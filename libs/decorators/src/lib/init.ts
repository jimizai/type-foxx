import { defineMethodMetadata, MethodTagEnum } from '@jimizai/utils';

export function Init(): MethodDecorator {
  return (_target, _key, descriptor) => {
    defineMethodMetadata(descriptor.value, MethodTagEnum.INIT);
  };
}
