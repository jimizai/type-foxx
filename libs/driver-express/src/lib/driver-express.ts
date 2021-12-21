import { FactoryContainer, Inject, Injectable } from '@jimizai/injectable';
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
import type { Typed } from '@jimizai/injectable';

export type Middleware = (
  req: Request,
  res: Response,
  next: () => Promise<void> | void
) => void;

export interface FoxxMiddleware {
  call(
    req: Request,
    res: Response,
    next: () => Promise<void> | void
  ): void | Promise<void>;
}

export interface FoxxContext extends Context {
  requestContext: {
    // eslint-disable-next-line
    get<T>(target: { new (...args: any[]): T }): T | undefined;
  };
}

@Injectable()
class ExtendContextMiddleware implements FoxxMiddleware {
  constructor(@Inject(INJECT_OPEN_API) private openApi: OpenApi) {
    //
  }

  async call(
    req: Request,
    _res: Response,
    next: () => void | Promise<void>
  ): Promise<void> {
    Object.assign(req, {
      requestContext: this.openApi,
    });
    await next();
  }
}

@Injectable()
class ExtendRouterArgsMiddleware implements FoxxMiddleware {
  constructor(@Inject(INJECT_OPEN_API) private openApi: OpenApi) {
    //
  }

  async call(req, res, next): Promise<void> {
    this.openApi.setRouterArgs({ req, res, ctx: null });
    await next();
  }
}

@Driver()
export class ExpressFoxxDriver implements FoxxDriver {
  public instance: express.Application;

  private globalMiddlewares: Typed<FoxxMiddleware>[] = [
    ExtendContextMiddleware,
    ExtendRouterArgsMiddleware,
  ];

  constructor(
    @Inject(INJECT_SERVER_PORT) private port: number = 7001,
    @Inject(INJECT_FOXX_MIDDLEWARES) middlewares: Typed<FoxxMiddleware>[] = [],
    @Inject(INJECT_ROUTES) private routes: Route[] = [],
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
    this.globalMiddlewares.forEach((foxxMiddleware) => {
      const middleware = FactoryContainer.factory(foxxMiddleware);
      this.instance.use(middleware.call.bind(middleware));
    });
    this.useRoutes();
    this.instance.listen(this.port, () => {
      console.log('server started on http://localhost:' + this.port);
    });
  }
}
