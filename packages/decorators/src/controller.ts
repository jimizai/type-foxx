import { PATH_METADATA } from "./constants";
import { normalizePath } from "./utils";

export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
//deno-lint-ignore no-inferrable-types
export function Controller(prefix: string = "/"): ClassDecorator {
  return (target) => {
    prefix = normalizePath(prefix);
    Reflect.defineMetadata(PATH_METADATA, prefix, target);
  };
}
