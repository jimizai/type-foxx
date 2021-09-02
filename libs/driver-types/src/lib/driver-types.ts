import { InjectableClass } from '@jimizai/injectable';
import { BaseExceptions } from '@jimizai/common';

export interface FoxxDriverOptions {
  port?: number;
}

export interface FoxxDriver {
  bootstrap(): void;
}

export interface FoxxApplication {
  get<T>(target: { new (...args: any[]): T }): T;
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
  canActivate: (...args: any[]) => Promise<boolean>;
}

export interface FoxxFactoryInterface {
  get<T>(identity: string): T;
  getRoutes(): Route[];
  getHandlers(): {
    instance: any;
    handlers: any[];
  }[];
}

export enum ClassTypeEnum {
  Driver,
  Controller,
  Middleware,
  ErrorHandler,
  Normal,
}

export interface Module {
  identifer: string;
  type: ClassTypeEnum;
  target: InjectableClass;
  instance: any;
  // special inject arg
  helper?: any;
}

export interface Catchers<Calllback> {
  default: Calllback;
  [name: string]: Calllback;
}

export interface OpenApi {
  get<T>(target: { new (...args: any[]): T }): T | undefined;
  setRouterArgs(args: { ctx: any; req: any; res: any }): void;
}

export interface Catcher<E = BaseExceptions, T = any, K = any> {
  catch(error: E, req: T, res?: K): void;
}
