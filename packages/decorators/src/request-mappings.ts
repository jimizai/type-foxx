import { METHOD_METADATA, PATH_METADATA } from "./constants";
import { normalizePath } from "./utils";

export enum RequestMethod {
  GET = 1,
  POST,
  PUT,
  DELETE,
  PATCH,
  OPTIONS,
  HEAD,
  ALL,
}

export interface RequestMappingMetadata {
  path?: string;
  method?: RequestMethod;
}

const defaultMetadata: RequestMappingMetadata = {
  path: "/",
  method: RequestMethod.GET,
};

export const RequestMapping = (
  metadata: RequestMappingMetadata = defaultMetadata,
): MethodDecorator => {
  const path = normalizePath(metadata.path);
  const requestMethod = metadata.method || RequestMethod.GET;

  return (
    // deno-lint-ignore no-explicit-any
    _target: any,
    _key: string | symbol,
    // deno-lint-ignore no-explicit-any
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
    return descriptor;
  };
};

const createMappingDecorator = (method: RequestMethod) =>
  (
    path?: string,
  ): MethodDecorator =>
    RequestMapping({
      path,
      method,
    });

export const Get = createMappingDecorator(RequestMethod.GET);

export const Post = createMappingDecorator(RequestMethod.POST);

export const Put = createMappingDecorator(RequestMethod.PUT);

export const Delete = createMappingDecorator(RequestMethod.DELETE);

export const Patch = createMappingDecorator(RequestMethod.PATCH);

export const Options = createMappingDecorator(RequestMethod.OPTIONS);

export const Head = createMappingDecorator(RequestMethod.HEAD);

export const All = createMappingDecorator(RequestMethod.ALL);
