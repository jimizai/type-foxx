export const normalizePath = (path: string): string => (path.startsWith("/") ? path : `/${path}`);

export const isUndefined = (val: unknown): val is undefined => typeof val === "undefined";

export const isNil = (val: unknown): val is null | undefined => isUndefined(val) || val === null;

export const isObject = (val: unknown): val is object => !isNil(val) && typeof val === "object";

export const isString = (val: unknown): val is string => typeof val === "string";

export const isConstructor = (val: unknown): boolean => val === "constructor";

export const isEmpty = (val: any): boolean => val?.length === 0;

export const isSymbol = (fn: unknown): fn is symbol => typeof fn === "symbol";

export const isPlainObject = (obj: unknown): boolean =>
	Object.prototype.toString.call(obj) === "[object Object]";

export const isArray = Array.isArray;

export const toArray = <T>(arr: T | T[]): T[] => (isArray(arr) ? arr : [arr]);

export const isFunction = (val: unknown): val is Function => typeof val === "function";

export const isClass = (fn) => {
	try {
		new fn();
		return true;
	} catch {
		return false;
	}
};

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export function getParamNames(func) {
	console.log(func.toString());
	const fnStr = func.toString().replace(STRIP_COMMENTS, "");
	let result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(ARGUMENT_NAMES);
	if (result === null) {
		result = [];
	}
	return result;
}
