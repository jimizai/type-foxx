import { Context, FoxxMiddleware, NextFunction } from '../interface';
import {
  getOwnMethodNames,
  hasMethodMetadata,
  MethodTagEnum,
} from '@jimizai/utils';

export class InitImplMiddleware implements FoxxMiddleware {
  call(ctx: Context<any>, next: NextFunction): void {
    next();
    const methodKeys = getOwnMethodNames(ctx.instance);
    methodKeys.forEach((key) => {
      if (hasMethodMetadata(ctx.instance[key], MethodTagEnum.INIT)) {
        ctx.FactoryContainer.initMethods.push(
          ctx.instance[key].apply(ctx.instance)
        );
      }
    });
  }
}
