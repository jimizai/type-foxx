import { RoutesContainer } from "@jimizai/core";
import { ArgType, PARAM_ALL } from "@jimizai/decorators";
import { FoxxDriver, FoxxDriverOptions } from "@jimizai/driver-types";
import { Application } from "express";
import ExtendContext from "./context";

const express = require("express");

const debug = require("debug")("driver-express");

export type Middleware = (
  req: Request,
  res: Response,
  next: () => Promise<void> | void,
) => void;

const defaultDriverOptions: FoxxDriverOptions = {
  port: 7001,
};

type ExtendInterface<T> = {
  [P in keyof T]: T[P];
};

export class ExpressFoxxDriver implements FoxxDriver<Middleware> {
  public instance: Application;
  public middlewares: Middleware[] = [];

  constructor(
    private routesContainer: RoutesContainer,
    private options: FoxxDriverOptions = defaultDriverOptions,
  ) {
    this.instance = express();
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

  useMiddlewares(middlewares: Middleware[]) {
    this.middlewares = [...this.middlewares, ...middlewares];
    return this;
  }

  public useRoutes() {
    const routes = this.routesContainer.getRoutes();
    const extendContext = this.makeExtendContext(this.routesContainer);
    routes.forEach((route) => {
      this.instance[route.method](
        route.url,
        async (req, res, next) => {
          const ctx = extendContext({ req, res });
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
    return this;
  }

  public init() {
    this.middlewares.forEach((middleware) => {
      debug("middleware", middleware.toString());
      // deno-lint-ignore no-explicit-any
      this.instance.use(middleware as any);
    });
    this.useRoutes();
    this.instance.listen(this.options.port, () => {
      console.log("server started on http://localhost:" + this.options.port);
    });
  }
}
