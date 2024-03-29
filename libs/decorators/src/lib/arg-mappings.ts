import { PARAM_METADATA } from './constants';

export enum ArgType {
  Query = 'query',
  Param = 'param',
  Body = 'body',
  Req = 'req',
  Res = 'res',
  Ctx = 'ctx',
}

export interface Arg {
  name: string;
  argType: ArgType;
  parameterIndex: number;
}

export const makeArgMappings =
  (argType: ArgType) =>
  (argName?: string): ParameterDecorator =>
  (target, propertyKey: string | symbol, parameterIndex: number) => {
    const args: Arg[] =
      Reflect.getMetadata(PARAM_METADATA, target.constructor, propertyKey) ||
      [];
    args.push({
      name: argName,
      argType,
      parameterIndex,
    });
    Reflect.defineMetadata(
      PARAM_METADATA,
      args,
      target.constructor,
      propertyKey
    );
  };

export const Query = makeArgMappings(ArgType.Query);
export const Param = makeArgMappings(ArgType.Param);
export const Body = makeArgMappings(ArgType.Body);
export const Ctx = makeArgMappings(ArgType.Ctx);
export const Request = makeArgMappings(ArgType.Req);
export const Req = Request;
export const Response = makeArgMappings(ArgType.Res);
export const Res = Response;
