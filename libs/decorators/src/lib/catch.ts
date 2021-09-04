import { CATCH_METADATA } from './constants';
import { Injectable } from '@jimizai/injectable';
import { Type } from './interface';

export function Catch(...exceptions: Type<any>[]): ClassDecorator {
  return (target) => {
    Injectable()(target);
    Reflect.defineMetadata(CATCH_METADATA, exceptions, target);
  };
}
