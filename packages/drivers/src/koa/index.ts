import { RoutesContainer } from "@jimizai/core";
import { ArgType, PARAM_ALL } from "@jimizai/decorators";
import { Context, Middleware } from "koa";
import ExtendContext from "./context";

const Koa = require("koa");
const Router = require("koa-router");

export interface KoaDriverOptions {
  port?: number;
}

const defaultDriverOptions: KoaDriverOptions = {
  port: 7001,
};

type ExtendInterface<T> = {
  [P in keyof T]: T[P];
};

interface FoxxContext extends Context, ExtendInterface<typeof ExtendContext> {
  //deno-lint-ignore no-explicit-any
  requestContext: { get(ident: string): any };
}

export class KoaDriver {
  public instance: typeof Koa;
  public routerInstance: typeof Router;
  public middlewares: Middleware[] = [];

  constructor(
    private routesContainer: RoutesContainer,
    private options: KoaDriverOptions = defaultDriverOptions,
  ) {
    this.instance = new Koa();
    this.routerInstance = new Router();
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  private makeExtendContext(
    routesContainer: RoutesContainer,
  ): (ctx: Context) => FoxxContext {
    return (ctx) => {
      ctx.requestContext = {
        get(identity: string) {
          return routesContainer.get(identity);
        },
      };
      return Object.assign(ctx, ExtendContext) as FoxxContext;
    };
  }

  public useRoutes() {
    const routes = this.routesContainer.getRoutes();
    const extendContext = this.makeExtendContext(this.routesContainer);
    routes.forEach((route) => {
      this.routerInstance[route.method](
        route.url,
        async (koaCtx: Context, next) => {
          const ctx = extendContext(koaCtx);
          const args = route.args.map((arg) => {
            const target = arg.argType === ArgType.Query
              ? ctx.query
              : arg.argType === ArgType.Body
              ? // deno-lint-ignore no-explicit-any
                (ctx.request as any).body
              : ctx.params;
            if (arg.name === PARAM_ALL) {
              return target;
            } else {
              return target[arg.name];
            }
          });
          const controller = ctx.requestContext.get(route.identity);
          const func = controller[route.funcName];
          await func?.apply?.(controller, args);
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
    this.middlewares.forEach((middleware) => this.instance.use(middleware));
    this.useRoutes();
    this.instance.listen(this.options.port, () => {
      console.log("server started on http://localhost:" + this.options.port);
    });
  }
}
