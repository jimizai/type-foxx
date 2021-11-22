import { Context, FoxxMiddleware, NextFunction } from '../interface';
import { INJECT_PROPERTY_KEYS } from '../constants';
import { ScopeEnum } from '../enum';
import { isNil } from '@jimizai/utils';

export class InjectPropertyImplMiddleware implements FoxxMiddleware {
  call(ctx: Context<any>, next: NextFunction): void {
    next();
    const keys = Reflect.getMetadata(INJECT_PROPERTY_KEYS, ctx.target) || [];
    keys.forEach((key) => {
      const identifier = key.identifier;
      if (!isNil(ctx.containers[identifier])) {
        ctx.instance[key.propertyKey] = ctx.containers[identifier];
        return;
      }

      if (
        ctx.metadata?.scope === ScopeEnum.Request &&
        ['ctx', 'req', 'request', 'response', 'res'].includes(key.propertyKey)
      ) {
        let propertyKey = key.propertyKey;
        if (propertyKey === 'request') {
          propertyKey = 'req';
        }
        if (propertyKey === 'response') {
          propertyKey = 'res';
        }
        ctx.instance[key.propertyKey] =
          ctx.FactoryContainer.getRouterArg(propertyKey);
        return;
      }

      const targetName =
        identifier.charAt(0).toUpperCase() + identifier.substring(1);
      const injectTarget = ctx.modules[targetName];
      ctx.instance[key.propertyKey] = ctx.factory(injectTarget);
    });
  }
}
