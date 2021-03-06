import {
  ArgType,
  Controller,
  Get,
  Query,
  RequestMethod,
} from "@jimizai/decorators";
import { CLASS_METADATA, Injectable } from "@jimizai/injectable";
import { RoutesContainer } from "../src/routes";

@Injectable()
class B {
  b = 12;

  index() {
    console.log("this is a b");
  }
}

@Injectable()
@Controller("/test")
class A {
  constructor(public b: B) {}
  @Get("/ttt")
  test(@Query("id") _id: string) {
    this.b.index();
  }
}

function C() {}

test("injecable targets", () => {
  const injectableModules = [A, B, C].filter((module) =>
    Reflect.getMetadata(CLASS_METADATA, module)
  );
  expect(injectableModules[0]).toBe(A);
  expect(injectableModules[1]).toBe(B);
});

test("bootstrap data init tests", () => {
  const routesInstance = new RoutesContainer([A, B]);
  const routes = routesInstance.getRoutes();
  const route = routes[0];
  expect(route.method).toBe(RequestMethod.GET);
  expect(route.url).toBe("/test/ttt(/.+)?");
  const arg = route.args[0];
  expect(arg.parameterIndex).toBe(0);
  expect(arg.name).toBe("id");
  expect(arg.argType).toBe(ArgType.Query);
});
