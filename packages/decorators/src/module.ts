import { MODULE_METADATA } from "./constants";

//deno-lint-ignore no-explicit-any
export type Provider = (...args: any[]) => ({
  provide: string;
  //deno-lint-ignore no-explicit-any
  useValues: any;
});
export interface ModuleOptions {
  srcDir?: string;
  providers?: Provider[];
}

export function Module(options?: ModuleOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_METADATA, options || {}, target);
  };
}
