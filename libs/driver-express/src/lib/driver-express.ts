import { Inject } from '@jimizai/injectable';
import { BaseExceptions } from '@jimizai/common';
import {
  FoxxDriver,
  INJECT_FOXX_MIDDLEWARES,
  INJECT_ROUTES,
  INJECT_SERVER_PORT,
  INJECT_OPEN_API,
  Route,
  OpenApi,
  INJECT_CATCHERS,
  Catchers,
} from '@jimizai/driver-types';
import { Driver, ArgType, PARAM_ALL } from '@jimizai/decorators';
import { Context } from './context';
import * as express from 'express';

export type Middleware = (
  req: Request,
  res: Response,
  next: () => Promise<void> | void
) => void;

export interface FoxxContext extends Context {
  requestContext: {
    get<T>(target: { new (...args: any[]): T }): T | undefined;
  };
}

@Driver()
export class ExpressFoxxDriver implements FoxxDriver {
  public instance: express.Application;

  private globalMiddlewares: Middleware[] = [
    this.extendContext(),
    this.extendRouterArgs(),
  ];

  constructor(
    @Inject(INJECT_SERVER_PORT) private port: number = 7001,
    @Inject(INJECT_FOXX_MIDDLEWARES) middlewares: Middleware[] = [],
    @Inject(INJECT_ROUTES) private routes: Route[] = [],
    @Inject(INJECT_OPEN_API) private openApi: OpenApi,
    @Inject(INJECT_CATCHERS)
    private catchers: Catchers<
      <T extends BaseExceptions>(
        error: T,
        req: express.Request & { requestContext: OpenApi },
        res: express.Response
      ) => void
    >
  ) {
    this.instance = express();
    this.globalMiddlewares = [...this.globalMiddlewares, ...middlewares];
  }

  private extendContext() {
    return async (req, _, next) => {
      Object.assign(req, {
        requestContext: this.openApi,
      });
      await next();
    };
  }

  private extendRouterArgs() {
    return async (req, res, next) => {
      this.openApi.setRouterArgs({ req, res, ctx: null });
      await next();
    };
  }

  private errorHandler(
    func: (
      req: express.Request & { requestContext: OpenApi },
      res: express.Response,
      next: () => void
    ) => void
  ) {
    return async (
      req: express.Request & { requestContext: OpenApi },
      res: express.Response,
      next: () => void
    ) => {
      try {
        await func(req, res, next);
      } catch (error) {
        if (!Object.keys(this.catchers).length) {
          console.error(error);
          res.send({
            code: error.getStatus?.() || 500,
            message: error.getMessage?.() || 'Internal server error',
          });
        } else {
          const catcherName = error.name || 'default';
          const callback =
            this.catchers[catcherName] || this.catchers['default'];
          callback?.(error, req, res);
        }
      }
    };
  }

  private useRoutes() {
    this.routes.forEach((route) => {
      this.instance[route.method](
        route.url,
        this.errorHandler(async (req, res, next) => {
          const result = await route.canActivate(req, res);
          if (!result) {
            return;
          }
          const args = route.args.map((arg) => {
            if (arg.argType === ArgType.Ctx) {
              return null;
            } else if (arg.argType === ArgType.Req) {
              return req;
            } else if (arg.argType === ArgType.Res) {
              return res;
            }
            const target =
              arg.argType === ArgType.Query
                ? req.query
                : arg.argType === ArgType.Body
                ? req.body
                : req.params;
            if (!arg.name) {
              return;
            }
            if (arg.name === PARAM_ALL) {
              return target;
            } else {
              return target[arg.name];
            }
          });
          const controller = req.requestContext.get(route.target);
          const func = controller[route.funcName];
          const data = await func?.apply?.(controller, args);
          if (data) {
            res.send(data);
          }
          await next();
        })
      );
    });
    return this;
  }

  public bootstrap() {
    this.globalMiddlewares.forEach((middleware) => {
      this.instance.use(middleware as any);
    });
    this.useRoutes();
    this.instance.listen(this.port, () => {
      console.log('server started on http://localhost:' + this.port);
    });
  }
}
