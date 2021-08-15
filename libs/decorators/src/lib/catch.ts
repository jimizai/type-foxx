import { CATCH_METADATA } from './constants';
import { Injectable } from '@jimizai/injectable';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export function Catch(...exceptions: Type<any>[]): ClassDecorator {
  return (target) => {
    Injectable()(target);
    Reflect.defineMetadata(CATCH_METADATA, exceptions, target);
  };
}
