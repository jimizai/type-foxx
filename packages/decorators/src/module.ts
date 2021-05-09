import { MODULE_METADATA } from "./constants";

export interface ModuleOptions {
  srcDir?: string;
}

export function Module(options: ModuleOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_METADATA, target, options);
  };
}
