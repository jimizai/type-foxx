import { Route } from "@jimizai/core";
import { KoaDriver } from "../src";

const routes: Route[] = [
  {
    method: "get",
    url: "/test",
    func: () => {
    },
    target: {},
    args: [],
  },
];

test("test koa driver", () => {
  const driver = new KoaDriver();
  driver.use((ctx) => {
    ctx.body = "hello";
  });
  expect(driver.middlewares.length).toBe(1);
  driver.use((ctx) => {
    ctx.body = "hello";
  });
  expect(driver.middlewares.length).toBe(2);

  driver.useRoutes(routes);
  expect(driver.routerInstance.stack.length).toBe(1);
  expect(driver.middlewares.length).toBe(4);
});
