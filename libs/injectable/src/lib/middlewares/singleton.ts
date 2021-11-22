import { Context, FoxxMiddleware, NextFunction } from '../interface';
import { ScopeEnum } from '../enum';

const INJECT_SINGLETON_METADATA = 'INJECT_SINGLETON_METADATA';

export class SingletonFactoryMiddleware implements FoxxMiddleware {
  call(ctx: Context<any>, next: NextFunction): void {
    if (Reflect.getMetadata(INJECT_SINGLETON_METADATA, ctx.target)) {
      ctx.instance = Reflect.getMetadata(INJECT_SINGLETON_METADATA, ctx.target);
      return;
    }
    next();
    if (ctx.metadata?.scope === ScopeEnum.Singleton && ctx.instance) {
      Reflect.defineMetadata(
        INJECT_SINGLETON_METADATA,
        ctx.instance,
        ctx.target
      );
    }
  }
}
