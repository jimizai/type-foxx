import {
  CLASS_DEPS,
  CLASS_INJECT_ARGS_METADATA,
  CLASS_METADATA,
} from "./constants";
import { ModuleContainer } from "./container";
import { getConstructorParams } from "./utils";

export const Injectable = (): ClassDecorator =>
  (target) => {
    const deps = getConstructorParams(target);
    const injectableArgs =
      Reflect.getMetadata(CLASS_INJECT_ARGS_METADATA, target) || [];
    injectableArgs.forEach((item) => {
      deps[item.paramterIndex] = item.identity;
    });
    Reflect.defineMetadata(CLASS_DEPS, deps, target);
    Reflect.defineMetadata(CLASS_METADATA, target, target);
    ModuleContainer.add(target);
  };

export const Inject = (identity: string): ParameterDecorator =>
  (target, propertyName, paramterIndex) => {
    if (!propertyName) {
      // constructor
      const args = Reflect.getMetadata(CLASS_INJECT_ARGS_METADATA, target) ||
        [];
      args.push({ identity, paramterIndex });

      Reflect.defineMetadata(CLASS_INJECT_ARGS_METADATA, args, target);
    }
  };
