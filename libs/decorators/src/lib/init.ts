import { INIT_METADATA } from './constants';

export function Init(): MethodDecorator {
  return (_target, _key, descriptor) => {
    Reflect.defineMetadata(INIT_METADATA, true, descriptor.value);
  };
}
