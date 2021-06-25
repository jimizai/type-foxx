import { NotFoundException } from "@jimizai/common";
import { ArgType, PARAM_ALL } from "@jimizai/decorators";
import {
  FoxxDriver,
  FoxxDriverOptions,
  FoxxFactoryInterface,
} from "@jimizai/driver-types";
import { Context, Middleware } from "koa";
import ExtendContext from "./context";

const Koa = require("koa");
const debug = require("debug")("koa-foxx-driver");
const Router = require("koa-router");

const defaultDriverOptions: FoxxDriverOptions = {
  port: 7001,
};

type ExtendInterface<T> = {
  [P in keyof T]: T[P];
};

const isUndefined = (val: unknown): val is undefined =>
  typeof val === "undefined";

interface FoxxContext extends Context, ExtendInterface<typeof ExtendContext> {
  //deno-lint-ignore no-explicit-any
  requestContext: { get(ident: string): any };
}

export class KoaFoxxDriver implements FoxxDriver<Middleware> {
  public instance: typeof Koa;
  public routerInstance: typeof Router;
  public middlewares: Middleware[] = [];

  constructor(
    private factoryContainer: FoxxFactoryInterface,
    private options: FoxxDriverOptions = defaultDriverOptions,
  ) {
    this.instance = new Koa();
    this.routerInstance = new Router();
    this.addErrorHandlerMiddleware();
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  private makeExtendContext(
    factoryContainer: FoxxFactoryInterface,
  ): (ctx: Context) => FoxxContext {
    return (ctx) => {
      ctx.requestContext = {
        get(identity: string) {
          return factoryContainer.get(identity);
        },
      };
      return Object.assign(ctx, ExtendContext) as FoxxContext;
    };
  }

  useMiddlewares(middlewares: Middleware[]) {
    this.middlewares = [...this.middlewares, ...middlewares];
    return this;
  }

  private addErrorHandlerMiddleware() {
    const extendContext = this.makeExtendContext(this.factoryContainer);
    const handlers = this.factoryContainer.getHandlers();
    this.use(
      async (koaCtx: Context, next) => {
        const ctx = extendContext(koaCtx);
        try {
          await next();
          if (isUndefined(ctx.body) && ctx.status === 404) {
            throw new NotFoundException();
          }
        } catch (error) {
          console.error(error);
          if (!handlers.length) {
            ctx.body = {
              code: error.getStatus?.() || 500,
              message: error.getMessage?.() || "Internal server error",
            };
          }
          handlers.forEach((item) => {
            if (!item.handlers.length) {
              item.instance.catch?.(error, ctx);
            } else {
              item.handlers.forEach((handler) => {
                if (error instanceof handler) {
                  item.instance.catch?.(error, ctx);
                }
              });
            }
          });
        }
      },
    );
  }

  public useRoutes() {
    const routes = this.factoryContainer.getRoutes();
    const extendContext = this.makeExtendContext(this.factoryContainer);
    routes.forEach((route) => {
      this.routerInstance[route.method](
        route.url,
        async (koaCtx: Context, next) => {
          const ctx = extendContext(koaCtx);
          const args = route.args.map((arg) => {
            if (arg.argType === ArgType.Ctx) {
              return ctx;
            } else if (arg.argType === ArgType.Req) {
              return ctx.req;
            } else if (arg.argType === ArgType.Res) {
              return ctx.res;
            }
            const target = arg.argType === ArgType.Query
              ? ctx.query
              : arg.argType === ArgType.Body
              ? // deno-lint-ignore no-explicit-any
                (ctx.request as any).body
              : ctx.params;
            if (!arg.name) {
              return;
            }
            if (arg.name === PARAM_ALL) {
              return target;
            } else {
              return target[arg.name];
            }
          });
          const controller = ctx.requestContext.get(route.identity);
          const func = controller[route.funcName];
          const data = await func?.apply?.(controller, args);
          if (data) {
            ctx.body = data;
          }
          await next();
        },
      );
    });
    this.use(this.routerInstance.routes()).use(
      this.routerInstance.allowedMethods(),
    );
    return this;
  }

  public init() {
    this.useRoutes();
    this.middlewares.forEach((middleware) => {
      debug("middleware", middleware.toString());
      this.instance.use(middleware);
    });
    this.instance.listen(this.options.port, () => {
      console.log("server started on http://localhost:" + this.options.port);
    });
  }
}
