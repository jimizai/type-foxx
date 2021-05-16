import { CATCH_METADATA } from "./constants";

//deno-lint-ignore no-explicit-any
export interface Type<T = any> extends Function {
  //deno-lint-ignore no-explicit-any
  new (...args: any[]): T;
}

//deno-lint-ignore no-explicit-any
export function Catch(...exceptions: Type<any>[]): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CATCH_METADATA, exceptions, target);
  };
}
