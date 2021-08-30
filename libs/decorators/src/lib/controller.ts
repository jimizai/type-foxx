import { PATH_METADATA } from './constants';
import { normalizePath } from '@jimizai/utils';
import { Injectable, ScopeEnum } from '@jimizai/injectable';

export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(prefix = '/'): ClassDecorator {
  return (target) => {
    Injectable({ scope: ScopeEnum.Request })(target);
    prefix = normalizePath(prefix);
    Reflect.defineMetadata(PATH_METADATA, prefix, target);
  };
}
