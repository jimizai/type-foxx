export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  OPTIONS = 'options',
  HEAD = 'head',
  ALL = 'all',
}

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export interface ArgumentMetadata {
  //
}

export interface PipeTransform<T = any, R = any> {
  /**
   * Method to implement a custom pipe.  Called with two parameters
   *
   * @param value argument before it is received by route handler method
   * @param metadata contains metadata about the value
   */
  transform(value: T, metadata: ArgumentMetadata): R;
}

export interface CanActivate {
  canActivate(context: any): boolean | Promise<boolean>;
  canActivate(req: any, res: any): boolean | Promise<boolean>;
}

export interface MethodMetadata {
  method: RequestMethod;
  pipes: PipeTransform[];
  guards: CanActivate[];
}
