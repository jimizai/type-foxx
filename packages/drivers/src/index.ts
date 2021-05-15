export * from "./koa";

export interface FoxxDriverOptions {
  port?: number;
}

export interface FoxxDriver<Middleware> {
  init(): void;
  useRoutes(): this;
  useMiddlewares(middlewares: Middleware[]): this;
  use(middleware: Middleware): this;
}
