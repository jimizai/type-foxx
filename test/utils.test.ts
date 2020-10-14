import {
	normalizePath,
	isEmpty,
	isSymbol,
	isString,
	isUndefined,
	isConstructor,
	isObject,
	isPlainObject,
	isNil
} from "../src/utils";

describe("utils test", () => {
	it("normalizePath", () => {
		const path1 = "/";
		const path2 = "/test";
		const path3 = "test";
		const path4 = "";

		expect(normalizePath(path1)).toBe("/");
		expect(normalizePath(path2)).toBe("/test");
		expect(normalizePath(path3)).toBe("/test");
		expect(normalizePath(path4)).toBe("/");
	});

	it("isEmpty", () => {
		expect(isEmpty([])).toBe(true);
		expect(isEmpty(new Set())).toBe(false);
		expect(isEmpty({})).toBe(false);
		expect(isEmpty(undefined)).toBe(false);
	});

	it("isSymbol", () => {
		const symbol1 = Symbol();
		const symbol2 = Symbol("sym");
		const symbol3 = Symbol;
		const symbol4 = Symbol.for("sym");
		expect(isSymbol(symbol1)).toBe(true);
		expect(isSymbol(symbol2)).toBe(true);
		expect(isSymbol(symbol3)).toBe(false);
		expect(isSymbol(symbol4)).toBe(true);
	});

	it("isString", () => {
		const str1 = "";
		const str2 = "hello";
		expect(isString(str1)).toBe(true);
		expect(isString(str2)).toBe(true);
	});

	it("isUndefined", () => {
		expect(isUndefined(undefined)).toBe(true);
	});

	it("isConstructor", () => {
		expect(isConstructor("constructor")).toBe(true);
	});

	it("isObject", () => {
		expect(isObject({})).toBe(true);
		expect(isObject(null)).toBe(false);
		expect(isObject([])).toBe(true);
	});

	it("isPlainObject", () => {
		expect(isPlainObject({})).toBe(true);
		expect(isPlainObject([])).toBe(false);
	});

	it("isNil", () => {
		expect(isNil(null)).toBe(true);
		expect(isNil(undefined)).toBe(true);
		expect(isNil("")).toBe(false);
	});
});
