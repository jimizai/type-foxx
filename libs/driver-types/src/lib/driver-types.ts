export interface FoxxDriverOptions {
  port?: number;
}

export interface FoxxDriver {
  bootstrap(): void;
}

export enum ArgType {
  Query = 'query',
  Param = 'param',
  Body = 'body',
  Req = 'req',
  Res = 'res',
  Ctx = 'ctx',
}

export interface Route {
  method: string;
  url: string;
  funcName: string;
  identity: string;
  target: { new <T>(...args: any[]): T };
  args: {
    name: string;
    argType: ArgType;
    parameterIndex: number;
  }[];
}

export interface FoxxFactoryInterface {
  get<T>(identity: string): T;
  getRoutes(): Route[];
  getHandlers(): {
    instance: any;
    handlers: any[];
  }[];
}
