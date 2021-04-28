import { CLASS_SCOPE, Scope, ScopeEnum } from "../src";

@Scope(ScopeEnum.Singleton)
class A {
}

test("add scope", () => {
  const scope = Reflect.getMetadata(CLASS_SCOPE, A);
  expect(scope).toBe(ScopeEnum.Singleton);
});
