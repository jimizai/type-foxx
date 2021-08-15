import {
  Inject,
  Injectable,
  FactoryContainer,
  InjectableClass,
} from '@jimizai/injectable';
import {
  ScopeEnum,
  PATH_METADATA,
  MIDDLEWARE_METADATA,
  CATCH_METADATA,
  CLASS_SCOPE,
  DRIVER_METADATA,
  Type,
} from '@jimizai/decorators';
import { INJECT_SRC_DIRS, Module, ClassTypeEnum } from '@jimizai/driver-types';
import { Loader } from '@jimizai/loader';

@Injectable({ providedIn: 'root' })
export class CollectionFactory {
  private modules: Module[] = [];

  constructor(
    @Inject(INJECT_SRC_DIRS) private srcDirs: string | string[],
    private loader: Loader
  ) {}

  private async loadModules(): Promise<InjectableClass[]> {
    await this.loader.load(this.srcDirs);
    const moduleCollection = FactoryContainer.getModules();
    return Object.entries(moduleCollection).map(([_, model]) => model);
  }

  private getModuleArgs(module: InjectableClass): [ClassTypeEnum, any] {
    const types = [
      [DRIVER_METADATA, ClassTypeEnum.Driver],
      [PATH_METADATA, ClassTypeEnum.Controller],
      [MIDDLEWARE_METADATA, ClassTypeEnum.Middleware],
      [CATCH_METADATA, ClassTypeEnum.ErrorHandler],
    ];
    for (const [type, classType] of types) {
      const arg = Reflect.getMetadata(type, module);
      if (arg) {
        return [classType as ClassTypeEnum, arg];
      }
    }
    return [ClassTypeEnum.Normal, undefined];
  }

  private getModuleScope(module: InjectableClass): ScopeEnum {
    return Reflect.getMetadata(CLASS_SCOPE, module) || ScopeEnum.Request;
  }

  async initModules(): Promise<void> {
    const modules = await this.loadModules();
    this.modules = modules
      .map((module) => {
        const [type, helper] = this.getModuleArgs(module);
        if (type === ClassTypeEnum.Driver) {
          // driver not init
          return;
        }
        return {
          identifer: module.name,
          type,
          target: module,
          instance: FactoryContainer.factory(module),
          scope: this.getModuleScope(module),
          helper,
        };
      })
      .filter(Boolean);
  }

  private makeFilter(type: ClassTypeEnum) {
    return this.modules.filter((module) => module.type === type);
  }

  get<T>(identifer: string): T | undefined {
    const target = this.modules.find(
      (module) => module.identifer === identifer
    );
    if (!target) return target as undefined;
    const instance = target.instance;
    return new Proxy(
      {
        __is_proxy__: true,
      },
      {
        get(obj: any, prop) {
          if (typeof obj[prop] === 'function') {
            return obj[prop].bind(obj);
          }
          if (typeof instance[prop] === 'function') {
            return instance[prop].bind(instance);
          }
          return obj[prop] || instance[prop];
        },
      }
    );
  }

  getControllers() {
    return this.makeFilter(ClassTypeEnum.Controller);
  }

  getMiddlewares() {
    return this.makeFilter(ClassTypeEnum.Middleware);
  }

  getErrorHandlers() {
    const handlers = this.makeFilter(ClassTypeEnum.ErrorHandler);
    const catchers = {};
    handlers.forEach((handler) => {
      if ((handler.helper as Type<any>[])?.length) {
        handler.helper.forEach((exception) => {
          const error = new exception();
          catchers[error.name] = handler.instance.catch;
        });
      } else {
        catchers['default'] = handler.instance.catch;
      }
    });
    return catchers;
  }
}