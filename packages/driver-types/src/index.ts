export interface FoxxDriverOptions {
  port?: number;
}

export interface FoxxDriver<Middleware> {
  init(): void;
  useRoutes(): this;
  useMiddlewares(middlewares: Middleware[]): this;
  use(middleware: Middleware): this;
}

enum ArgType {
  Query = "query",
  Param = "param",
  Body = "body",
  Req = "req",
  Res = "res",
  Ctx = "ctx",
}

export interface Route {
  method: string;
  url: string;
  funcName: string;
  identity: string;
  args: { name: string; argType: ArgType; parameterIndex: number }[];
}

export interface FoxxFactoryInterface {
  get<T>(identity: string): T;
  getRoutes(): Route[];
  // deno-lint-ignore no-explicit-any
  getHandlers(): { instance: any; handlers: any[] }[];
}
