import { PARAM_ALL, PARAM_METADATA } from "./constants";

export enum ArgType {
  Query = "query",
  Param = "param",
  Body = "body",
}

export interface Arg {
  name: string;
  argType: ArgType;
  parameterIndex: number;
}

export const makeArgMappings = (
  argType: ArgType,
) =>
  (argName = PARAM_ALL): ParameterDecorator =>
    //deno-lint-ignore no-explicit-any
    (target: any, propertyKey: string | symbol, parameterIndex: number) => {
      const method = target[propertyKey];
      const args: Arg[] = Reflect.getMetadata(PARAM_METADATA, method) || [];
      args.push({
        name: argName,
        argType,
        parameterIndex,
      });
      Reflect.defineMetadata(PARAM_METADATA, args, method);
    };

export const Query = makeArgMappings(ArgType.Query);
export const Param = makeArgMappings(ArgType.Param);
export const Body = makeArgMappings(ArgType.Body);
