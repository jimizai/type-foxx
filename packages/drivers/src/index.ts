import { RoutesContainer } from "@jimizai/core";

export * from "./koa";

export interface FoxxDriverOptions {
  port?: number;
}

export interface FoxxDriver<Middleware> {
  init(): void;
  useRoutes(): this;
  //deno-lint-ignore no-misused-new
  constructor(
    routesInstance: RoutesContainer,
    options: FoxxDriverOptions,
  ): void;
  use(middleware: Middleware): this;
}
