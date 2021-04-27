import { CLASS_METADATA, CLASS_DEPS } from "./constants";
import { getConstructorParams } from "./utils";
import { ModuleContainer } from "./container";

export const Injectable = (): ClassDecorator => (target) => {
  const deps = getConstructorParams(target);
  Reflect.defineMetadata(CLASS_DEPS, deps, target);
  Reflect.defineMetadata(CLASS_METADATA, target, target);
  ModuleContainer.add(target);
};
