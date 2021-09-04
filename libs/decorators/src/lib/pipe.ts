import { PipeTransform, Type } from './interface';
import { FactoryContainer } from '@jimizai/injectable';
import { setMethodMetadata } from './utils';

export function UsePipes(...pipes: Type<PipeTransform>[]): MethodDecorator {
  return (target, key) => {
    setMethodMetadata(target, key, {
      pipes: pipes.map((pipe) => FactoryContainer.factory(pipe)),
    });
  };
}
