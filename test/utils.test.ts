import {
  normalizePath,
  isEmpty,
  // isSymbol,
  // isString,
  // isUndefined,
  // isConstructor,
  // isObject,
  // isPlainObject,
  // isNil,
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
  });
});
