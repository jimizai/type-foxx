import { Injectable } from '@jimizai/injectable';
import {
  PATH_METADATA,
  METHOD_METADATA,
  PARAM_METADATA,
} from '@jimizai/decorators';
import { CollectionFactory } from './collection';
import { Route } from '@jimizai/driver-types';
import * as path from 'path';

@Injectable()
export class Router {
  constructor(private collectionFactory: CollectionFactory) {}

  async initRoutes(): Promise<Route[]> {
    await this.collectionFactory.initModules();
    return this.collectionFactory
      .getControllers()
      .map(({ target, instance }) => {
        const prefixPath = Reflect.getMetadata(PATH_METADATA, target);
        const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
        const methodKeys = Object.keys(descriptors);
        for (const index in methodKeys) {
          const methodName = methodKeys[index];
          if (methodName === 'constructor') {
            continue;
          }
          const func = descriptors[methodName].value;
          let url = Reflect.getMetadata(PATH_METADATA, func) || '/';
          const method = Reflect.getMetadata(METHOD_METADATA, func);
          const args =
            Reflect.getMetadata(PARAM_METADATA, target, methodName) || [];
          if (url === '/') {
            url = '';
          }
          url += '(/.+)?';
          if (url && method) {
            return {
              method,
              url: path.join(prefixPath, url),
              args: args.sort((x, y) => x.parameterIndex - y.parameterIndex),
              funcName: methodName,
              identity: target.name,
              instance,
              target,
            };
          }
        }
      })
      .filter(Boolean);
  }
}
