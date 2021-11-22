import { isNil, isFunction, isObject } from '@jimizai/utils';
import { TARGET_INJECTABLE } from '..';
import { FoxxMiddleware, Typed, Context } from './interface';
import { FactoryCoreMiddleware } from './middlewares/core';
import { InitImplMiddleware } from './middlewares/init';
import { InjectPropertyImplMiddleware } from './middlewares/inject-property';
import { SingletonFactoryMiddleware } from './middlewares/singleton';

export type InjectableClass<T = any> = { new (...args: any[]): T };

export type InjectTarget<T = any> =
  | InjectableClass<T>
  | {
      providedKey: string;
      providedValue: any;
    };

type InjectFullTarget<T = any> = InjectableClass<T> & {
  providedKey: string;
  providedValue: any;
};

type ResourceOf<T> = T extends InjectableClass<infer R> ? R : T;

export interface BootstrapOptions<T extends InjectableClass[]> {
  providers?: InjectTarget[];
  entries: T;
}

const middlewares: Array<FoxxMiddleware> = [
  SingletonFactoryMiddleware,
  InjectPropertyImplMiddleware,
  InitImplMiddleware,
  FactoryCoreMiddleware,
].map((middleware) => new middleware());

export class FactoryContainer {
  static targets: { [key: string]: any } = {};
  static middlewares: Array<FoxxMiddleware> = middlewares;
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

  static call(middleware: Typed<FoxxMiddleware>) {
    this.apply([middleware]);
  }

  static apply(middlewares: Array<Typed<FoxxMiddleware>>) {
    this.middlewares = [
      ...middlewares.map((m) => new m()),
      ...this.middlewares,
    ];
  }

  static compose(ctx: Context, index = 0) {
    if (!this.middlewares[index]) {
      return () => {
        //
      };
    }
    const next = () => {
      const nextTarget = this.middlewares[index];
      index++;
      return nextTarget.call(ctx, this.compose(ctx, index));
    };
    return next;
  }

  static factory<T>(c: InjectableClass<T>): T {
    if (isNil(c)) {
      return c;
    }
    const ctx: Context = {
      target: c,
      FactoryContainer: this,
      containers: this.targets,
      modules: this.modules,
      instance: null,
      factory: this.factory.bind(this),
      metadata: Reflect.getMetadata(TARGET_INJECTABLE, c),
    };
    this.compose(ctx)();
    return ctx.instance;
  }

  static async bootstrap<A extends InjectableClass>(
    opts: BootstrapOptions<[A]>
  ): Promise<[ResourceOf<A>]>;
  static async bootstrap<A extends InjectableClass, B extends InjectableClass>(
    opts: BootstrapOptions<[A, B]>
  ): Promise<[ResourceOf<A>, ResourceOf<B>]>;
  static async bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C]>
  ): Promise<[ResourceOf<A>, ResourceOf<B>, ResourceOf<C>]>;
  static async bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass,
    D extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C, D]>
  ): Promise<[ResourceOf<A>, ResourceOf<B>, ResourceOf<C>, ResourceOf<D>]>;
  static async bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass,
    D extends InjectableClass,
    E extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C, D, E]>
  ): Promise<
    [ResourceOf<A>, ResourceOf<B>, ResourceOf<C>, ResourceOf<D>, ResourceOf<E>]
  >;
  static async bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass,
    D extends InjectableClass,
    E extends InjectableClass,
    F extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C, D, E, F]>
  ): Promise<
    [
      ResourceOf<A>,
      ResourceOf<B>,
      ResourceOf<C>,
      ResourceOf<D>,
      ResourceOf<E>,
      ResourceOf<F>
    ]
  >;
  static async bootstrap<
    A extends InjectableClass,
    B extends InjectableClass,
    C extends InjectableClass,
    D extends InjectableClass,
    E extends InjectableClass,
    F extends InjectableClass,
    G extends InjectableClass
  >(
    opts: BootstrapOptions<[A, B, C, D, E, F, G]>
  ): Promise<
    [
      ResourceOf<A>,
      ResourceOf<B>,
      ResourceOf<C>,
      ResourceOf<D>,
      ResourceOf<E>,
      ResourceOf<F>,
      ResourceOf<G>
    ]
  >;
  static async bootstrap<T extends InjectableClass>(
    opts: BootstrapOptions<T[]>
  ): Promise<Array<ResourceOf<T>>> {
    if (!opts.entries.length) {
      throw new Error('entries is required');
    }
    opts.providers?.forEach?.((provider: InjectFullTarget) => {
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
