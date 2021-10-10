import {
  INJECT_ARG_INDEX,
  TARGET_INJECTABLE,
  INJECT_PROPERTY_KEYS,
} from './constants';
import {
  isUndefined,
  isNil,
  getOwnMethodNames,
  hasMethodMetadata,
  MethodTagEnum,
  isFunction,
  isObject,
} from '@jimizai/utils';
import { ScopeEnum } from './enum';

const JS_TYPE_VECTOR = [Symbol, String, Number, Boolean, Object, Array, BigInt];
export type InjectableClass<T = any> = { new (...args: any[]): T };

export type InjectTarget<T = any> = InjectableClass<T> & {
  providedKey: string;
  providedValue: any;
};

type ResourceOf<T> = T extends InjectableClass<infer R> ? R : T;

export interface BootstrapOptions<T extends InjectableClass[]> {
  providers?: InjectTarget[];
  entries: T;
}

export class FactoryContainer {
  static targets: { [key: string]: any } = {};
  static modules: {
    [key: string]: InjectableClass;
  } = {};
  static cached: {
    [key: string]: any;
  } = {};

  static routerArgs = {
    ctx: null,
    req: null,
    res: null,
  };

  static setRouterArgs(routerArgs = { ctx: null, req: null, res: null }) {
    FactoryContainer.routerArgs = routerArgs;
  }

  static getRouterArg(key: string) {
    return FactoryContainer.routerArgs[key] || null;
  }

  static initMethods: (() => Promise<void>)[] = [];

  static setModule(identifier: string, value: InjectableClass) {
    FactoryContainer.modules[identifier] = value;
  }

  static getModule(identifier: string): InjectableClass {
    return FactoryContainer.modules[identifier];
  }

  static getModules(): { [key: string]: InjectableClass } {
    return FactoryContainer.modules;
  }

  static bind(key: string, value: any) {
    FactoryContainer.targets[key] = value;
  }

  static get(key: string) {
    return FactoryContainer.targets[key];
  }

  static factory<T>(c: InjectableClass<T>): T {
    if (isNil(c)) {
      return c;
    }
    if (FactoryContainer.cached[c.name]) {
      return FactoryContainer.cached[c.name];
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

    const classMetadata = Reflect.getMetadata(TARGET_INJECTABLE, c);

    // impl inject property
    const keys = Reflect.getMetadata(INJECT_PROPERTY_KEYS, c) || [];
    keys.forEach((key) => {
      const identifier = key.identifier;
      if (!isNil(FactoryContainer.get(identifier))) {
        target[key.propertyKey] = FactoryContainer.get(identifier);
        return;
      }

      if (
        classMetadata.scope === ScopeEnum.Request &&
        ['ctx', 'req', 'request', 'response', 'res'].includes(key.propertyKey)
      ) {
        let propertyKey = key.propertyKey;
        if (propertyKey === 'request') {
          propertyKey = 'req';
        }
        if (propertyKey === 'response') {
          propertyKey = 'res';
        }
        target[key.propertyKey] = FactoryContainer.getRouterArg(propertyKey);
        return;
      }

      const targetName =
        identifier.charAt(0).toUpperCase() + identifier.substring(1);
      const injectTarget = FactoryContainer.getModule(targetName);
      target[key.propertyKey] = FactoryContainer.factory(injectTarget);
    });

    const methodKeys = getOwnMethodNames(target as any);
    methodKeys.forEach((key) => {
      if (hasMethodMetadata(target[key], MethodTagEnum.INIT)) {
        FactoryContainer.initMethods.push(target[key].apply(target));
      }
    });
    if (classMetadata.scope === ScopeEnum.Singleton) {
      FactoryContainer.cached[c.name] = target;
    }

    return target;
  }

  static bootstrap<A extends InjectableClass>(
    opts: BootstrapOptions<[A]>
  ): [ResourceOf<A>];
  static bootstrap<A extends InjectableClass, B extends InjectableClass>(
    opts: BootstrapOptions<[A, B]>
  ): [ResourceOf<A>, ResourceOf<B>];
  static bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C]>
  ): [ResourceOf<A>, ResourceOf<B>, ResourceOf<C>];
  static bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass,
    D extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C, D]>
  ): [ResourceOf<A>, ResourceOf<B>, ResourceOf<C>, ResourceOf<D>];
  static bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass,
    D extends InjectableClass,
    E extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C, D, E]>
  ): [
    ResourceOf<A>,
    ResourceOf<B>,
    ResourceOf<C>,
    ResourceOf<D>,
    ResourceOf<E>
  ];
  static bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass,
    D extends InjectableClass,
    E extends InjectableClass,
    F extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C, D, E, F]>
  ): [
    ResourceOf<A>,
    ResourceOf<B>,
    ResourceOf<C>,
    ResourceOf<D>,
    ResourceOf<E>,
    ResourceOf<F>
  ];
  static bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass,
    D extends InjectableClass,
    E extends InjectableClass,
    F extends InjectableClass,
    G extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C, D, E, F, G]>
  ): [
    ResourceOf<A>,
    ResourceOf<B>,
    ResourceOf<C>,
    ResourceOf<D>,
    ResourceOf<E>,
    ResourceOf<F>,
    ResourceOf<G>
  ];
  static async bootstrap<T extends InjectableClass>(
    opts: BootstrapOptions<T[]>
  ): Promise<Array<ResourceOf<T>>> {
    if (!opts.entries.length) {
      throw new Error('entries is required');
    }
    opts.providers?.forEach?.((provider) => {
      if (isFunction(provider)) {
        this.factory(provider);
      } else if (isObject(provider) && provider.providedKey) {
        this.bind(provider.providedKey, provider.providedValue);
      }
    });

    const result = opts.entries?.map?.((entry) =>
      isFunction(entry) ? this.factory(entry) : entry
    );
    await Promise.all(this.initMethods);
    return result;
  }
}
