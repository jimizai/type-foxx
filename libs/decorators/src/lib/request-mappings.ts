import { PATH_METADATA } from './constants';
import { normalizePath } from '@jimizai/utils';
import { setMethodMetadata } from './utils';
import { RequestMethod } from './interface';

export interface RequestMappingMetadata {
  path?: string;
  method?: RequestMethod;
}

const defaultMetadata: RequestMappingMetadata = {
  path: '/',
  method: RequestMethod.GET,
};

export const RequestMapping = (
  metadata: RequestMappingMetadata = defaultMetadata
): MethodDecorator => {
  const path = normalizePath(metadata.path || '/');
  const requestMethod = metadata.method || RequestMethod.GET;

  return (
    // eslint-disable-next-line
    target: any,
    key: string | symbol,
    // eslint-disable-next-line
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    Reflect.defineMetadata(PATH_METADATA, path, target.constructor, key);
    setMethodMetadata(target.constructor, key, { method: requestMethod });
    return descriptor;
  };
};

const createMappingDecorator =
  (method: RequestMethod) =>
  (path?: string): MethodDecorator =>
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
