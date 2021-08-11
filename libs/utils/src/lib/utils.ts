export const isUndefined = (val: unknown): val is undefined =>
  typeof val === 'undefined';

export const isNull = (val: unknown): val is null => val === null;

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
