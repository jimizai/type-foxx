export const toArray = <T>(arr: T | T[]): T[] =>
  Array.isArray(arr) ? arr : [arr];
export const isFunction = (func: unknown): boolean =>
  typeof func === "function";

export const equalType = (old: unknown, newer: unknown): boolean =>
  typeof old === typeof newer;

export const isObject = (val: unknown): boolean =>
  Object.prototype.toString.call(val) === "[object Object]";

export const isArray = Array.isArray;
