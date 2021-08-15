import { Injectable } from '@jimizai/injectable';
import { MIDDLEWARE_METADATA } from './constants';

export function Middleware(): ClassDecorator {
  return (target) => {
    Injectable()(target);
    Reflect.defineMetadata(MIDDLEWARE_METADATA, true, target);
  };
}
