import {
  INJECT_ARG_INDEX,
  TARGET_INJECTABLE,
  ROOT_TARGET_INJECTABLE,
} from './constants';
import { isNotEmpty } from '@jimizai/utils';

export class Container {
  static targets: { [key: string]: any } = {};

  static bind(key: string, value: any) {
    this.targets[key] = value;
  }

  static get(key: string) {
    return this.targets[key] || {};
  }

  static factory = <T>(c: any): T => {
    const args = Reflect.getMetadata('design:paramtypes', c);
    const replaceArgs = Reflect.getMetadata(INJECT_ARG_INDEX, c) || [];
    replaceArgs.forEach(({ index, identifier }) => {
      args[index] = Container.get(identifier) || {};
    });
    return new c(
      ...(args?.map((arg) => {
        if (!(typeof arg === 'object' || typeof arg === 'function')) {
          return arg;
        }
        const data = Reflect.getMetadata(TARGET_INJECTABLE, arg);
        if (isNotEmpty(Reflect.getMetadata(ROOT_TARGET_INJECTABLE, arg))) {
          return Reflect.getMetadata(ROOT_TARGET_INJECTABLE, arg);
        }
        let result = arg;
        if (data) {
          result = Container.factory(arg);
          if (data.providedIn === 'root') {
            Reflect.defineMetadata(ROOT_TARGET_INJECTABLE, result, arg);
          }
        }
        return result;
      }) || [])
    );
  };
}
