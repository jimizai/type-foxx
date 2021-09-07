import { Injectable, FactoryContainer } from '@jimizai/injectable';
import {
  PATH_METADATA,
  METHOD_METADATA,
  PARAM_METADATA,
} from '@jimizai/decorators';
import { CollectionFactory } from './collection';
import { Route } from '@jimizai/driver-types';
import { BaseExceptions } from '@jimizai/common';
import { getMethodMetadata } from '@jimizai/decorators';
import * as path from 'path';

@Injectable()
export class Router {
  constructor(private collectionFactory: CollectionFactory) {}

  async initRoutes(): Promise<Route[]> {
    await this.collectionFactory.initModules();
    return this.collectionFactory
      .getControllers()
      .reduce((prev, { target, instance }) => {
        const prefixPath = Reflect.getMetadata(PATH_METADATA, target);
        const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
        const methodKeys = Object.keys(descriptors);

        const routes = [];
        for (const index in methodKeys) {
          const methodName = methodKeys[index];
          if (methodName === 'constructor') {
            continue;
          }
          let url =
            Reflect.getMetadata(PATH_METADATA, target, methodName) || '/';
          const args =
            Reflect.getMetadata(PARAM_METADATA, target, methodName) || [];
          if (url === '/') {
            url = '';
          }
          url += '(/.+)?';

          const { guards, method } = getMethodMetadata(target, methodName);
          if (url && method) {
            routes.push({
              method,
              url: path.join(prefixPath, url),
              args: args.sort((x, y) => x.parameterIndex - y.parameterIndex),
              funcName: methodName,
              identity: target.name,
              instance,
              target,
              async canActivate(...args: any[]) {
                const results = await Promise.all(
                  // @ts-ignore
                  guards.map((guard) => guard.canActivate(...args))
                );
                if (results.includes(false)) {
                  throw new BaseExceptions(
                    'Forbidden',
                    403,
                    'Forbidden resource'
                  );
                }
                return true;
              },
            });
          }
        }
        return [...prev, ...routes];
      }, [])
      .filter(Boolean);
  }
}
