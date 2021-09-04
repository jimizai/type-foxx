import { CanActivate } from './interface';
import { setMethodMetadata } from './utils';
import { FactoryContainer } from '@jimizai/injectable';

type Type<T> = { new (...args: any[]): T };

export function UseGuards<T extends Type<CanActivate>>(
  ...args: T[]
): ClassDecorator & MethodDecorator {
  return (target, key?: string) => {
    if (key) {
      setMethodMetadata(target.constructor, key, {
        guards: args.map((arg) => FactoryContainer.factory(arg)),
      });
    } else {
      //
    }
  };
}
