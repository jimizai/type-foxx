import { RoutesContainer } from "@jimizai/core";
import { ArgType, PARAM_ALL } from "@jimizai/decorators";
import { FoxxDriver, FoxxDriverOptions } from "@jimizai/driver-types";
import { Application, Request, Response } from "express";
import { extendsContext } from "./context";

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

  useMiddlewares(middlewares: Middleware[]) {
    this.middlewares = [...this.middlewares, ...middlewares];
    return this;
  }

  private errorHandler(
    func: (req: Request, res: Response, next: () => void) => void,
  ) {
    const handlers = this.routesContainer.getHandlers();
    return async (req, res, next) => {
      try {
        await func(req, res, next);
      } catch (error) {
        const ctx = extendsContext(req, res);
        if (!handlers.length) {
          res.send({
            code: error.getStatus?.() || 500,
            message: error.getMessage?.() || "Internal server error",
          });
        } else {
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
      }
    };
  }

  public useRoutes() {
    const routes = this.routesContainer.getRoutes();
    const { routesContainer } = this;
    routes.forEach((route) => {
      this.instance[route.method](
        route.url,
        this.errorHandler(async (req, res, next) => {
          const ctx = extendsContext(req, res);
          ctx.requestContext = {
            get(identity: string) {
              return routesContainer.get(identity);
            },
          };
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
            ctx.res.send(data);
          }
          await next();
        }),
      );
    });
    return this;
  }

  public init() {
    this.middlewares.forEach((middleware) => {
      debug("middleware", middleware.toString());
      this.instance.use(this.errorHandler(middleware));
    });
    this.useRoutes();
    this.instance.listen(this.options.port, () => {
      console.log("server started on http://localhost:" + this.options.port);
    });
  }
}
