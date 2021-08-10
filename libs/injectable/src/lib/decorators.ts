import { TARGET_INJECTABLE, INJECT_ARG_INDEX } from './constants';
import { Container } from './container';

export function Injectable(args: { providedIn?: 'root' } = {}): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(TARGET_INJECTABLE, args, target);
  };
}

export function Inject(identifier: string): ParameterDecorator {
  return (target, _propertyKey: string | symbol, parameterIndex: number) => {
    const args = Reflect.getMetadata(INJECT_ARG_INDEX, target) || [];
    args.push({ index: parameterIndex, identifier });
    const AutoHandleError = () => {
      throw new Error('请先在Container中绑定' + identifier);
    };
    Injectable()(AutoHandleError);
    Container.bind(identifier, AutoHandleError);
    Reflect.defineMetadata(INJECT_ARG_INDEX, args, target);
  };
}
