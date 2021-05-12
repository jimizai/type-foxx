import { MODULE_METADATA } from "./constants";

export interface DynamicModule {
  srcDirs?: string | string[];
  providers?: Provider[];
  //deno-lint-ignore ban-types
  modules?: (Function | DynamicModule)[];
}
export interface Provider {
  provide: string;
  //deno-lint-ignore no-explicit-any
  useValues: any;
}

export function Module(options?: DynamicModule): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_METADATA, options || {}, target);
  };
}
