import { GUARDS_METADATA, DEFAULT_GUARDS } from './constants';
type Type<T> = { new (...args: any[]): T };

export interface CanActivate {
  canActivate(context: any): boolean | Promise<boolean>;
  canActivate(req: any, res: any): boolean | Promise<boolean>;
}

export function UseGuards<T extends Type<CanActivate>>(
  ...args: T[]
): ClassDecorator & MethodDecorator {
  return (target, key?: string) => {
    if (key) {
      target = target.constructor;
    }
    const guardsObject = Reflect.getMetadata(GUARDS_METADATA, target) || {};
    if (!key) {
      key = DEFAULT_GUARDS;
    }
    guardsObject[key] = [...new Set([...(guardsObject[key] || []), ...args])];
    Reflect.defineMetadata(GUARDS_METADATA, guardsObject, target);
  };
}

export const getGuards = (target, key: string): Type<CanActivate>[] => {
  const guardsObject = Reflect.getMetadata(GUARDS_METADATA, target) || {};
  return [
    ...new Set([
      ...(guardsObject[key] || []),
      ...(guardsObject[DEFAULT_GUARDS] || []),
    ]),
  ];
};
