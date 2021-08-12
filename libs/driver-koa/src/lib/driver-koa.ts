import { ArgType, PARAM_ALL } from '@jimizai/decorators';
import { Container, Inject, Injectable } from '@jimizai/injectable';
import {
  FoxxDriver,
  INJECT_FOXX_MIDDLEWARES,
  INJECT_ROUTES,
  INJECT_SERVER_PORT,
  Route,
} from '@jimizai/driver-types';
import { Context, Middleware } from 'koa';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import ExtendContext from './context';

type ExtendInterface<T> = {
  [P in keyof T]: T[P];
};

interface FoxxContext extends Context, ExtendInterface<typeof ExtendContext> {
  requestContext: { get(ident: new <T>(...args: any[]) => T): any };
}

@Injectable()
export class KoaFoxxDriver implements FoxxDriver {
  public instance: Koa;
  public routerInstance: Router;

  private globalMiddlewares: Middleware[] = [];

  constructor(
    @Inject(INJECT_SERVER_PORT) private port: number = 7001,
    @Inject(INJECT_FOXX_MIDDLEWARES) middlewares: Middleware[] = [],
    @Inject(INJECT_ROUTES) private routes: Route[] = []
  ) {
    this.instance = new Koa();
    this.routerInstance = new Router();
    this.globalMiddlewares = middlewares;
  }

  private use(middleware: Middleware) {
    this.globalMiddlewares.push(middleware);
    return this;
  }

  private makeExtendContext(): (ctx: Context) => FoxxContext {
    return (ctx) => {
      ctx.requestContext = {
        get<T>(identity: { new (...args): T }) {
          return Container.factory(identity);
        },
      };
      return Object.assign(ctx, ExtendContext) as FoxxContext;
    };
  }

  private useRoutes() {
    const extendContext = this.makeExtendContext();
    this.routes.forEach((route) => {
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