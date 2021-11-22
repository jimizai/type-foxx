import { Context, FoxxMiddleware, NextFunction } from '../interface';
import { TARGET_INJECTABLE, INJECT_ARG_INDEX } from '../constants';
import { isUndefined, isNil } from '@jimizai/utils';

const JS_TYPE_VECTOR = [Symbol, String, Number, Boolean, Object, Array, BigInt];

export class FactoryCoreMiddleware implements FoxxMiddleware {
  call(ctx: Context<any>, next: NextFunction): void {
    const args = Reflect.getMetadata('design:paramtypes', ctx.target);
    const replaceArgs = Reflect.getMetadata(INJECT_ARG_INDEX, ctx.target) || [];
    replaceArgs.forEach(({ index, identifier }) => {
      if (!isUndefined(ctx.containers[identifier])) {
        args[index] = ctx.containers[identifier];
      }
    });

    // factory
    ctx.instance = new ctx.target(
      ...(args?.map((arg, index) => {
        if (isNil(arg)) {
          return arg;
        }
        if (JS_TYPE_VECTOR.includes(arg)) {
          console.warn(
            '[WARN]',
            ctx.target.name,
            `The index at ${index} parameter is not injected in class ${ctx.target.name}`
          );
          return undefined;
        }
        if (typeof arg !== 'object' && typeof arg !== 'function') {
          return arg;
        }
        const data = Reflect.getMetadata(TARGET_INJECTABLE, arg);
        let result = arg;
        if (data) {
          result = ctx.factory(arg);
        }
        return result;
      }) || [])
    );

    next();
  }
}
