import { PATH_METADATA } from './constants';
import { normalizePath } from '@jimizai/utils';
import { Injectable } from '@jimizai/injectable';

export class RouteCollection {
  static routeModules = [];

  static setModule(m) {
    this.routeModules.push(m);
  }
  static getModules() {
    return this.routeModules;
  }
}

export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(prefix = '/'): ClassDecorator {
  return (target) => {
    RouteCollection.setModule(target);
    Injectable()(target);
    prefix = normalizePath(prefix);
    Reflect.defineMetadata(PATH_METADATA, prefix, target);
  };
}
