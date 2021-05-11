import { CLASS_DEPS } from "./constants";
import { getIdentByTarget } from "./utils";
const debug = require("debug")("type-foxx");
interface Module {
  name: string;
  // deno-lint-ignore no-explicit-any
  target: any;
  deps: string[];
  // deno-lint-ignore no-explicit-any
  instance: any;
}

class CircularDependencyDIException extends Error {
  constructor(target: string) {
    super("Circular dependency in DI detected for " + target);
    this.name = "CircularDependencyDIException";
  }
}

export class FactoryContainer {
  // deno-lint-ignore no-explicit-any
  protected container = new Map<string, any>();
  protected modules: { [identity: string]: Module } = {};

  constructor(
    // deno-lint-ignore no-explicit-any
    private targets: any[],
    private providers: {
      provide: string;
      // deno-lint-ignore no-explicit-any
      useValues: any;
    }[] = [],
  ) {
    this.initModules();
    debug("modules", this.modules);
    this.initFactory();
    this.initContainer();
    debug("container", this.container);
  }

  public get<T>(identity: string): T {
    const target = this.container.get(identity);
    if (!target) return target;
    return new Proxy(
      {
        __is_proxy__: true,
      },
      {
        // deno-lint-ignore no-explicit-any
        get(obj: any, prop) {
          if (typeof obj[prop] === "function") {
            return obj[prop].bind(obj);
          }
          if (typeof target[prop] === "function") {
            return target[prop].bind(target);
          }
          return obj[prop] || target[prop];
        },
      },
    );
  }

  private initModules() {
    this.modules = this.targets.reduce(
      (prev, target) => ({
        ...prev,
        ...{
          [getIdentByTarget(target)]: {
            name: target.name,
            target,
            deps: Reflect.getMetadata(CLASS_DEPS, target) || [],
            instance: null,
          },
        },
      }),
      {},
    );
    this.modules = this.providers.reduce((prev, provider) => ({
      ...prev,
      ...{
        [provider.provide]: {
          deps: [],
          name: provider.provide,
          target: {},
          instance: provider.useValues,
        },
      },
    }), this.modules);
  }

  private initFactory() {
    Object.keys(this.modules).forEach((key) => {
      this.factory(key);
    });
  }

  private initContainer() {
    Object.keys(this.modules).forEach((key) => {
      this.container.set(key, this.modules[key].instance);
    });
  }

  private factory(identity: string) {
    try {
      const module = this.modules[identity];
      if (!module) {
        return;
      }
      if (module.instance) {
        return module.instance;
      } else if (!module.deps.length) {
        module.instance = new module.target();
      } else {
        const args = module.deps.map((depIdentity) =>
          this.factory(depIdentity)
        );
        module.instance = new module.target(...args);
      }
      return module.instance;
    } catch (err) {
      debug("err", err);
      throw new CircularDependencyDIException(identity);
    }
  }
}
