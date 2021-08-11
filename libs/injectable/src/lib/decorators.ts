import { TARGET_INJECTABLE, INJECT_ARG_INDEX } from './constants';
import { isUndefined } from '@jimizai/utils';
import { Container } from './container';

export function Injectable(args: { providedIn?: 'root' } = {}): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(TARGET_INJECTABLE, args, target);
  };
}

export function Inject<T>(identifier: string, def?: T): ParameterDecorator {
  return (target, _propertyKey: string | symbol, parameterIndex: number) => {
    const args = Reflect.getMetadata(INJECT_ARG_INDEX, target) || [];
    args.push({ index: parameterIndex, identifier, def });
    if (isUndefined(def)) {
      const AutoHandleError = () => {
        throw new Error('请先在Container中绑定' + identifier);
      };
      Injectable()(AutoHandleError);
      Container.bind(identifier, AutoHandleError);
    }
    Reflect.defineMetadata(INJECT_ARG_INDEX, args, target);
  };
}
