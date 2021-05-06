import {
  ArgType,
  CLASS_SCOPE,
  Controller,
  Get,
  METHOD_METADATA,
  PARAM_METADATA,
  PATH_METADATA,
  Query,
  RequestMethod,
  Scope,
  ScopeEnum,
} from "../src";

@Scope(ScopeEnum.Singleton)
@Controller("/test")
class A {
  @Get("/api")
  index(@Query("name") _name: string) {
    //
  }
}

test("add scope", () => {
  const scope = Reflect.getMetadata(CLASS_SCOPE, A);
  expect(scope).toBe(ScopeEnum.Singleton);
});

test("add controller", () => {
  const path = Reflect.getMetadata(PATH_METADATA, A);
  expect(path).toBe("/test");
});

test("add request mappings", () => {
  const a = new A();
  const path = Reflect.getMetadata(PATH_METADATA, a.index);
  const method = Reflect.getMetadata(METHOD_METADATA, a.index);
  expect(path).toBe("/api");
  expect(method).toBe(RequestMethod.GET);
});

test("add request args", () => {
  const a = new A();
  const args = Reflect.getMetadata(PARAM_METADATA, a.index);
  const arg = args[0];
  expect(arg.name).toBe("name");
  expect(arg.argType).toBe(ArgType.Query);
  expect(arg.parameterIndex).toBe(0);
});
