import { NotFoundException, BaseExceptions } from '@jimizai/common';
import { ArgType, PARAM_ALL, Driver } from '@jimizai/decorators';
import {
  Inject,
  Injectable,
  Typed,
  FactoryContainer,
} from '@jimizai/injectable';
import { isUndefined } from '@jimizai/utils';
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
import { Context, Middleware } from 'koa';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import ExtendContext from './context';

type ExtendInterface<T> = {
  [P in keyof T]: T[P];
};

export interface FoxxContext
  extends Context,
    ExtendInterface<typeof ExtendContext> {
  //eslint-disable-next-line
  requestContext: { get<T>(target: { new (...args: any[]): T }): T };
}

export interface FoxxMiddleware {
  call: Middleware;
}

@Injectable()
class ExtendContextMiddleware implements FoxxMiddleware {
  constructor(@Inject(INJECT_OPEN_API) private openApi: OpenApi) {
    //
  }

  async call(ctx, next) {
    Object.assign(ctx, {
      requestContext: this.openApi,
    });
    Object.assign(ctx, ExtendContext) as FoxxContext;
    await next();
  }
}

@Injectable()
class ExtendRouterArgsMiddleware implements FoxxMiddleware {
  constructor(@Inject(INJECT_OPEN_API) private openApi: OpenApi) {
    //
  }
  async call(ctx, next) {
    this.openApi.setRouterArgs({ ctx, req: ctx.request, res: ctx.response });
    await next();
  }
}

@Injectable()
class ErrorHandlerMiddleware implements FoxxMiddleware {
  constructor(
    @Inject(INJECT_CATCHERS)
    private catchers: Catchers<
      <T extends BaseExceptions>(error: T, ctx: FoxxContext) => void
    >
  ) {
    //
  }
  async call(ctx, next) {
    try {
      await next();
      if (isUndefined(ctx.body) && ctx.status === 404) {
        throw new NotFoundException();
      }
    } catch (error) {
      if (!Object.keys(this.catchers).length) {
        console.error(error);
        ctx.body = {
          code: error.getStatus?.() || 500,
          message: error.getMessage?.() || 'Internal server error',
        };
      } else {
        const catcherName = error.name || 'default';
        const callback = this.catchers[catcherName] || this.catchers['default'];
        callback?.(error, ctx);
      }
    }
  }
}

@Driver()
export class KoaFoxxDriver implements FoxxDriver {
  public instance: Koa;
  public routerInstance: Router;

  private globalMiddlewares: Typed<FoxxMiddleware>[] = [
    ExtendContextMiddleware,
    ExtendRouterArgsMiddleware,
    ErrorHandlerMiddleware,
  ];

  constructor(
    @Inject(INJECT_SERVER_PORT) private port: number = 7001,
    @Inject(INJECT_FOXX_MIDDLEWARES) middlewares: Typed<FoxxMiddleware>[] = [],
    @Inject(INJECT_ROUTES) private routes: Route[] = []
  ) {
    this.instance = new Koa();
    this.routerInstance = new Router();
    this.globalMiddlewares = [...this.globalMiddlewares, ...middlewares];
  }

  private useRoutes() {
    this.routes.forEach((route) => {
      this.routerInstance[route.method](
        route.url,
        async (ctx: FoxxContext, next) => {
          const result = await route.canActivate(ctx);
          if (!result) {
            return;
          }

          const args = route.args.map((arg) => {
            if (arg.argType === ArgType.Ctx) {
              return ctx;
            } else if (arg.argType === ArgType.Req) {
              return ctx.req;
            } else if (arg.argType === ArgType.Res) {
              return ctx.res;
            }
            const target =
              arg.argType === ArgType.Query
                ? ctx.query
                : arg.argType === ArgType.Body
                ? // eslint-disable-next-line
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
          const controller = ctx.requestContext.get(route.target);
          const func = controller[route.funcName];
          const data = await func?.apply?.(controller, args);
          if (data) {
            ctx.body = data;
          }
          await next();
        }
      );
    });
    return this;
  }

  public bootstrap() {
    this.useRoutes();
    this.globalMiddlewares.forEach((foxxMiddleware) => {
      const middleware = FactoryContainer.factory(foxxMiddleware);
      this.instance.use(middleware.call.bind(middleware));
    });
    this.instance
      .use(this.routerInstance.routes())
      .use(this.routerInstance.allowedMethods());
    this.instance.listen(this.port, () => {
      console.log('server started on http://localhost:' + this.port);
    });
  }
}
