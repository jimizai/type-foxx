import { PATH_METADATA } from './constants';
import { normalizePath } from '@jimizai/utils';

export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(prefix = '/'): ClassDecorator {
  return (target) => {
    prefix = normalizePath(prefix);
    Reflect.defineMetadata(PATH_METADATA, prefix, target);
  };
}
