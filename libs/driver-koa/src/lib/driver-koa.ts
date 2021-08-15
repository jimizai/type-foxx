import { NotFoundException, BaseExceptions } from '@jimizai/common';
import { ArgType, PARAM_ALL, Driver } from '@jimizai/decorators';
import { Inject } from '@jimizai/injectable';
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
  requestContext: { get<T>(identifer: string): T };
}

@Driver()
export class KoaFoxxDriver implements FoxxDriver {
  public instance: Koa;
  public routerInstance: Router;

  private globalMiddlewares: Middleware[] = [
    this.extendContext(),
    this.errorHandler(),
  ];

  constructor(
    @Inject(INJECT_SERVER_PORT) private port: number = 7001,
    @Inject(INJECT_FOXX_MIDDLEWARES) middlewares: Middleware[] = [],
    @Inject(INJECT_ROUTES) private routes: Route[] = [],
    @Inject(INJECT_OPEN_API) private openApi: OpenApi,
    @Inject(INJECT_CATCHERS)
    private catchers: Catchers<
      <T extends BaseExceptions>(error: T, ctx: FoxxContext) => void
    >
  ) {
    this.instance = new Koa();
    this.routerInstance = new Router();
    this.globalMiddlewares = [...this.globalMiddlewares, ...middlewares];
  }

  private use(middleware: Middleware) {
    this.globalMiddlewares.push(middleware);
    return this;
  }

  private extendContext() {
    return async (ctx, next) => {
      Object.assign(ctx, {
        requestContext: this.openApi,
      });
      Object.assign(ctx, ExtendContext) as FoxxContext;
      await next();
    };
  }

  private errorHandler() {
    return async (ctx: FoxxContext, next) => {
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
          const callback =
            this.catchers[catcherName] || this.catchers['default'];
          callback?.(error, ctx);
        }
      }
    };
  }

  private useRoutes() {
    this.routes.forEach((route) => {
      this.routerInstance[route.method](
        route.url,
        async (ctx: FoxxContext, next) => {
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
                ? (ctx.request as any).body
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
        }
      );
    });
    this.use(this.routerInstance.routes()).use(
      this.routerInstance.allowedMethods()
    );
    return this;
  }

  public bootstrap() {
    this.useRoutes();
    this.globalMiddlewares.forEach((middleware) => {
      this.instance.use(middleware);
    });
    this.instance.listen(this.port, () => {
      console.log('server started on http://localhost:' + this.port);
    });
  }
}
