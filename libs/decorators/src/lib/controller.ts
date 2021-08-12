import { PATH_METADATA } from './constants';
import { normalizePath } from '@jimizai/utils';
import { Injectable } from '@jimizai/injectable';

export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(prefix = '/'): ClassDecorator {
  return (target) => {
    Injectable()(target);
    prefix = normalizePath(prefix);
    Reflect.defineMetadata(PATH_METADATA, prefix, target);
  };
}
