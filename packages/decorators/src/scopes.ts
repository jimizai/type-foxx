import { CLASS_SCOPE, ScopeEnum } from "./constants";

export const Scope = (scope: ScopeEnum): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(CLASS_SCOPE, scope, target);
  };
