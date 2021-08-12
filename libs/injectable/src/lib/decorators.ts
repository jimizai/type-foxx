import { TARGET_INJECTABLE, INJECT_ARG_INDEX } from './constants';

export function Injectable(args: { providedIn?: 'root' } = {}): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(TARGET_INJECTABLE, args, target);
  };
}

export function Inject(identifier: string): ParameterDecorator {
  return (target, _propertyKey: string | symbol, parameterIndex: number) => {
    const args = Reflect.getMetadata(INJECT_ARG_INDEX, target) || [];
    args.push({ index: parameterIndex, identifier });
    Reflect.defineMetadata(INJECT_ARG_INDEX, args, target);
  };
}
