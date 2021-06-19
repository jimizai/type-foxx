import createRouter = require("@arangodb/foxx/router");
import { ArgType, PARAM_ALL } from "@jimizai/decorators";
import { FoxxDriver, FoxxFactoryInterface } from "@jimizai/driver-types";
import { extendsContext } from "./context";

const router = createRouter();
module.context.use(router);

export type Middleware = (
  req: Foxx.Request,
  res: Foxx.Response,
  next: () => Promise<void> | void,
) => void;

export class TypeFoxxDriver implements FoxxDriver<Middleware> {
  public instance: Foxx.Router;
  public middlewares: Middleware[] = [];

  constructor(
    private factoryContainer: FoxxFactoryInterface,
  ) {
    this.instance = createRouter();
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
    func: (req: Foxx.Request, res: Foxx.Response, next: () => void) => void,
  ) {
    const handlers = this.factoryContainer.getHandlers();
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
    const routes = this.factoryContainer.getRoutes();
    const { factoryContainer } = this;
    routes.forEach((route) => {
      this.instance[route.method](
        route.url,
        this.errorHandler(async (req, res, next) => {
          const ctx = extendsContext(req, res);
          ctx.requestContext = {
            get(identity: string) {
              return factoryContainer.get(identity);
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
      module.context.use(this.errorHandler(middleware));
    });
    this.useRoutes();
  }
}
