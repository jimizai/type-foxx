import { MODULE_METADATA } from "./constants";

export interface DynamicModule {
  srcDir?: string;
  providers?: Provider[];
}
export interface Provider {
  provide: string;
  //deno-lint-ignore no-explicit-any
  useValues: any;
}
export interface ModuleOptions {
  srcDir?: string;
  providers?: Provider[];
  //deno-lint-ignore ban-types
  modules?: (Function | DynamicModule)[];
}

export function Module(options?: ModuleOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_METADATA, options || {}, target);
  };
}
