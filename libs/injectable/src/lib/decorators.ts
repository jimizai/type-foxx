import {
  TARGET_INJECTABLE,
  INJECT_ARG_INDEX,
  INJECT_PROPERTY_KEYS,
} from './constants';
import { FactoryContainer } from './container';
import { isNumber } from '@jimizai/utils';

export function Injectable(args: { providedIn?: 'root' } = {}): ClassDecorator {
  return (target) => {
    const identifier = target.name;
    FactoryContainer.setModule(identifier, target as any);
    Reflect.defineMetadata(TARGET_INJECTABLE, args, target);
  };
}

export function Inject(
  identifier?: string
): ParameterDecorator & PropertyDecorator {
  return (target, propertyKey: string | symbol, parameterIndex?: number) => {
    if (isNumber(parameterIndex)) {
      if (!identifier) {
        throw new Error('@Inject() field identifier is required');
      }
      const args = Reflect.getMetadata(INJECT_ARG_INDEX, target) || [];
      args.push({ index: parameterIndex, identifier });
      Reflect.defineMetadata(INJECT_ARG_INDEX, args, target);
    } else {
      const args =
        Reflect.getMetadata(INJECT_PROPERTY_KEYS, target.constructor) || [];
      args.push({ identifier: identifier || propertyKey, propertyKey });
      Reflect.defineMetadata(INJECT_PROPERTY_KEYS, args, target.constructor);
    }
  };
}
