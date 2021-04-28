import { CLASS_DEPS, CLASS_METADATA } from "./constants";
import { ModuleContainer } from "./container";
import { getConstructorParams } from "./utils";

export const Injectable = (): ClassDecorator =>
  (target) => {
    const deps = getConstructorParams(target);
    Reflect.defineMetadata(CLASS_DEPS, deps, target);
    Reflect.defineMetadata(CLASS_METADATA, target, target);
    ModuleContainer.add(target);
  };
