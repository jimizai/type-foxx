import {
  INJECT_ARG_INDEX,
  TARGET_INJECTABLE,
  ROOT_TARGET_INJECTABLE,
} from './constants';
import {
  isUndefined,
  isNil,
  getOwnMethodNames,
  hasMethodMetadata,
  MethodTagEnum,
} from '@jimizai/utils';

const JS_TYPE_VECTOR = [Symbol, String, Number, Boolean, Object, Array, BigInt];
export type InjectableClass = { new <T>(...args: any[]): T };
export class FactoryContainer {
  static targets: { [key: string]: any } = {};
  static modules: {
    [key: string]: InjectableClass;
  } = {};

  static initMethods: (() => Promise<void>)[] = [];

  static setModule(identifier: string, value: InjectableClass) {
    this.modules[identifier] = value;
  }

  static getModule(identifier: string): InjectableClass {
    return this.modules[identifier];
  }

  static getModules(): { [key: string]: InjectableClass } {
    return this.modules;
  }

  static bind(key: string, value: any) {
    this.targets[key] = value;
  }

  static get(key: string) {
    return this.targets[key];
  }

  static factory = <T>(c: { new (...args: any[]): T }): T => {
    if (Reflect.getMetadata(ROOT_TARGET_INJECTABLE, c)) {
      return Reflect.getMetadata(ROOT_TARGET_INJECTABLE, c);
    }

    // args replaced
    const args = Reflect.getMetadata('design:paramtypes', c);
    const replaceArgs = Reflect.getMetadata(INJECT_ARG_INDEX, c) || [];
    replaceArgs.forEach(({ index, identifier }) => {
      if (!isUndefined(FactoryContainer.get(identifier))) {
        args[index] = FactoryContainer.get(identifier);
      }
    });

    // factory
    const target = new c(
      ...(args?.map((arg, index) => {
        if (isNil(arg)) {
          return arg;
        }
        if (JS_TYPE_VECTOR.includes(arg)) {
          console.warn(
            '[WARN]',
            c.name,
            `The index at ${index} parameter is not injected in class ${c.name}`
          );
          return undefined;
        }
        if (typeof arg !== 'object' && typeof arg !== 'function') {
          return arg;
        }
        const data = Reflect.getMetadata(TARGET_INJECTABLE, arg);
        let result = arg;
        if (data) {
          result = FactoryContainer.factory(arg);
        }
        return result;
      }) || [])
    );

    // impl provideIn: 'root'
    const data = Reflect.getMetadata(TARGET_INJECTABLE, c);
    if (data && data.providedIn === 'root') {
      Reflect.defineMetadata(ROOT_TARGET_INJECTABLE, target, c);
    }

    const methodKeys = getOwnMethodNames(target as any);
    methodKeys.forEach((key) => {
      if (hasMethodMetadata(target[key], MethodTagEnum.INIT)) {
        FactoryContainer.initMethods.push(target[key].apply(target));
      }
    });

    return target;
  };
}
