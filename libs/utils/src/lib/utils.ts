export const isUndefined = (val: unknown): val is undefined =>
  typeof val === 'undefined';

export const isNull = (val: unknown): val is null => val === null;

export const isNumber = (val: unknown): val is number =>
  typeof val === 'number';

export const isObject = (val: unknown): boolean => typeof val === 'object';

export const isPlainObject = (val: unknown): boolean =>
  Object.prototype.toString.call(val) === '[object Object]';

export const isNil = (val: unknown): val is null | undefined =>
  isUndefined(val) || isNull(val);

export const isNotNil = (val: unknown): boolean => !isNil(val);

export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

// eslint-disable-next-line
export const isNotEmpty = (val: Record<string, any> | Array<any>): boolean => {
  if (!val) {
    return false;
  }
  if (Array.isArray(val)) {
    return !!val.length;
  }
  return JSON.stringify(val) !== '{}';
};

// eslint-disable-next-line
export const isEmpty = (val: Record<string, any> | Array<any>): boolean =>
  !isNotEmpty(val);

export const toArray = <T>(val: Array<T> | T): Array<T> =>
  Array.isArray(val) ? val : [val];

export const normalizePath = (path: string): string => {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
};

export const isFunction = (val: any): boolean => typeof val === 'function';

export const getOwnMethodNamesByProperty = (target: any): string[] => {
  if (!target) {
    return [];
  }
  const args = Object.getOwnPropertyNames(target).filter((key) => {
    try {
      return isFunction(target[key]);
    } catch {
      return false;
    }
  });
  return [...args, ...getOwnMethodNamesByProperty(target.__proto__)];
};

export const getOwnMethodNames = (target: any): string[] =>
  getOwnMethodNamesByProperty(target);

const FN_TAGS_METADATA = 'type-foxx:functions:tags';

export enum MethodTagEnum {
  INIT = 1 << 1,
}

export const getMethodMetadata = (method: any): MethodTagEnum => {
  return Reflect.getMetadata(FN_TAGS_METADATA, method);
};

export const defineMethodMetadata = (method: any, tag: MethodTagEnum) => {
  let symbol = getMethodMetadata(method);
  symbol |= tag;
  Reflect.defineMetadata(FN_TAGS_METADATA, symbol, method);
};

export const hasMethodMetadata = (method: any, tag: MethodTagEnum): boolean => {
  const symbol = getMethodMetadata(method);
  return Boolean(symbol & tag);
};

export const randomStr = () => Math.random().toString(36).substring(2);
