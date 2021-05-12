import { MODULE_METADATA } from "./constants";

export interface Provider {
  provide: string;
  //deno-lint-ignore no-explicit-any
  useValues: any;
}
export interface ModuleOptions {
  srcDir?: string;
  providers?: Provider[];
  //deno-lint-ignore ban-types
  modules?: Function[];
}

export function Module(options?: ModuleOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_METADATA, options || {}, target);
  };
}
