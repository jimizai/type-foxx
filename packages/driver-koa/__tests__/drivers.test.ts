import { RoutesContainer } from "@jimizai/core";
import { Controller, Get } from "@jimizai/decorators";
import { Injectable } from "@jimizai/injectable";
import { KoaFoxxDriver } from "../src";

@Injectable()
@Controller("/a")
class A {
  @Get("/test")
  test() {}
}
@Injectable()
@Controller("/b")
class B {
  @Get("/test")
  test() {}
}

describe("test koa driver", () => {
  const routeInstance = new RoutesContainer([A, B]);

  test("test koa driver use middleware", () => {
    const driver = new KoaFoxxDriver(routeInstance);
    expect(driver.middlewares.length).toBe(1);
    driver.use((ctx) => {
      ctx.body = "hello";
    });
    expect(driver.middlewares.length).toBe(2);
  });

  test("test koa driver", () => {
    const driver = new KoaFoxxDriver(routeInstance);
    driver.useRoutes();
    expect(driver.routerInstance.stack.length).toBe(2);
  });
});
