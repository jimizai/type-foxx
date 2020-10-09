import { METHOD_METADATA, PATH_METADATA } from "../constants";
import { RequestMethod } from "../enums";
import { normalizePath } from "../utils";

export interface RequestMappingMetadata {
  path?: string | string[];
  method?: RequestMethod;
}

const defaultMetadata: RequestMappingMetadata = {
  path: "/",
  method: RequestMethod.GET,
};

export const RequestMapping = (
  metadata: RequestMappingMetadata = defaultMetadata
):MethodDecorator => {
  const path = normalizePath(metadata.path)
  const requestMethod = metadata.method || RequestMethod.GET;

  return (_target:object, _key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    Reflect.defineMetadata(PATH_METADATA,path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
    return descriptor;
  }
}

const createMappingDecorator = (method: RequestMethod) => (
  path?: string | string[],
): MethodDecorator => {
  return RequestMapping({
    path,
    method
  });
};

export const Get = createMappingDecorator(RequestMethod.GET);

export const Post = createMappingDecorator(RequestMethod.POST);

export const Put = createMappingDecorator(RequestMethod.PUT);

export const Delete = createMappingDecorator(RequestMethod.DELETE);

export const Patch = createMappingDecorator(RequestMethod.PATCH);

export const Options = createMappingDecorator(RequestMethod.OPTIONS);

export const Head = createMappingDecorator(RequestMethod.HEAD);

export const All = createMappingDecorator(RequestMethod.ALL);