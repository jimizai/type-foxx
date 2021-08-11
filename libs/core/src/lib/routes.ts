import {
  Injectable,
  Inject,
  TARGET_INJECTABLE,
  Container,
} from '@jimizai/injectable';
import {
  PATH_METADATA,
  METHOD_METADATA,
  PARAM_METADATA,
  Arg,
} from '@jimizai/decorators';
import { Loader } from '@jimizai/loader';
import { isFunction } from '@jimizai/utils';
import { INJECT_SRC_DIRS } from '@jimizai/driver-types';
import * as path from 'path';

export interface Route {
  method: string;
  url: string;
  funcName: string;
  identity: string;
  args: Arg[];
}

@Injectable()
export class RoutesFactoryContainer {
  constructor(
    @Inject(INJECT_SRC_DIRS) private srcDirs: string | string[],
    private loader: Loader
  ) {}

  private async loadModules(): Promise<{ new <T>(): T }[]> {
    const m = await this.loader.load(this.srcDirs);
    const injectableModulesObject = m
      .filter(
        (module) =>
          isFunction(module) && Reflect.getMetadata(TARGET_INJECTABLE, module)
      )
      .reduce(
        (prev, target) => ({ ...prev, [target.name]: target }),
        {} as Record<string, { new <T>(): T }>
      );

    return Object.keys(injectableModulesObject).map(
      (key) => injectableModulesObject[key]
    );
  }

  async initRoutes(): Promise<Route[]> {
    const targets = await this.loadModules();

    return targets
      .map((target) => {
        const prefixPath = Reflect.getMetadata(PATH_METADATA, target);
        if (!prefixPath) return;
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
          const args = Reflect.getMetadata(PARAM_METADATA, func) || [];
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
              instance: Container.factory(target),
            };
          }
        }
      })
      .filter(Boolean);
  }
}
