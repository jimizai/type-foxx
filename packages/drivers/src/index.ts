export * from "./koa";

export interface FoxxDriverOptions {
  port?: number;
}

export interface FoxxDriver<Middleware> {
  init(): void;
  useRoutes(): this;
  use(middleware: Middleware): this;
}
