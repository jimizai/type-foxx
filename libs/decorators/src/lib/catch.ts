import { CATCH_METADATA } from './constants';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export function Catch(...exceptions: Type<any>[]): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CATCH_METADATA, exceptions, target);
  };
}
