import { DRIVER_METADATA } from './constants';
import { Injectable } from '@jimizai/injectable';

export function Driver(): ClassDecorator {
  return (target) => {
    Injectable()(target);
    Reflect.defineMetadata(DRIVER_METADATA, true, target);
  };
}
