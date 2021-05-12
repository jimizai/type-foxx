import { DynamicModule, MODULE_METADATA } from "@jimizai/decorators";
import { equalType, isArray, isFunction, isObject, toArray } from "./utils";

// deno-lint-ignore ban-types
type Target = Function;

type ModuleType = (Target | DynamicModule);

export class ModuleLoader {
  private modules: DynamicModule[] = [];
  public providerOject: {
    // deno-lint-ignore no-explicit-any
    [provide: string]: any;
  } = {};

  public srcDirs: string[] = [];

  constructor(public entryModule: ModuleType) {
    this.factory(entryModule);
    this.initProviderObjectAndSrcDirs();
  }

  initProviderObjectAndSrcDirs() {
    this.modules.forEach((module) => {
      if (module.providers?.length) {
        module.providers.forEach((provider) => {
          if (!this.providerOject[provider.provide]) {
            this.providerOject[provider.provide] = provider.useValues;
          } else {
            this.providerOject[provider.provide] = this.mergeData(
              this.providerOject[provider.provide],
              provider.useValues,
            );
          }
        });
      }
      if (module.srcDirs) {
        this.srcDirs = [...this.srcDirs, ...toArray(module.srcDirs)];
      }
    });
  }

  mergeData(oldValue, newValue) {
    if (!equalType(oldValue, newValue)) {
      return newValue;
    } else if (isObject(oldValue)) {
      return Object.assign(oldValue, newValue);
    } else if (isArray(oldValue)) {
      return [...oldValue, ...newValue];
    } else {
      return newValue;
    }
  }

  factory(module: ModuleType) {
    const moduleData: DynamicModule = isFunction(module)
      ? Reflect.getMetadata(MODULE_METADATA, module)
      : module;
    this.modules.push({
      srcDirs: toArray(moduleData.srcDirs),
      providers: moduleData.providers || [],
    });
    if (moduleData.modules && moduleData.modules.length) {
      moduleData.modules.map((module) => this.factory(module));
    }
  }
}
