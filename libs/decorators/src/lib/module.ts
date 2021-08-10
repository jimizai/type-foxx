import { MODULE_METADATA } from './constants';

export interface DynamicModule {
  srcDirs?: string | string[];
  providers?: Provider[];
  // eslint-disable-next-line
  modules?: (Function | DynamicModule)[];
}
export interface Provider {
  provide: string;
  useValues: any;
}

export function Module(options?: DynamicModule): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_METADATA, options || {}, target);
  };
}
