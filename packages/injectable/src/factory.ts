import { getConstructorParams } from "./utils";

interface Module {
  name: string;
  target: any;
  deps: string[];
  instance: any;
}

export class FactoryContainer {
  private container = new Map<string, any>();
  private modules: { [identity: string]: Module } = {};

  constructor(private targets: any[]) {
    this.initModules();
    this.initFactory();
    this.initContainer();
  }

  public get<T>(identity: string): T {
    const target = this.container.get(identity);
    if (!target) return target;
    return new Proxy(
      {
        __is_proxy__: true,
      },
      {
        get(obj: any, prop) {
          if (typeof obj[prop] === "function") {
            return obj[prop].bind(obj);
          }
          if (typeof target[prop] === "function") {
            return target[prop].bind(target);
          }
          return obj[prop] || target[prop];
        },
      }
    );
  }

  private initModules() {
    this.targets.reduce(
      (prev, target) => ({
        ...prev,
        ...{
          name: target.name,
          target,
          deps: getConstructorParams(target),
          instance: null,
        },
      }),
      {}
    );
    this.modules = {};
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
      if (module.instance) {
        return module.instance;
      } else if (!module.deps) {
        module.instance = new module.target();
      } else {
        const args: any[] = [];
        module.deps.forEach((depIdentity) => {
          args.push(this.factory(depIdentity));
        });
        module.instance = new module.target(...args);
      }
      return module.instance;
    } catch {
      console.log("循环引用");
    }
  }
}
