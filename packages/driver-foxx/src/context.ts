// deno-lint-ignore no-explicit-any
type Any = any;

export interface Context {
  req: Foxx.Request;
  res: Foxx.Response;
  request: Foxx.Request;
  response: Foxx.Response;
  params: Any;
  query: Any;
  body: Any;
  requestContext: { get(identity: string): Any };
}

export function extendsContext(req: Foxx.Request, res: Foxx.Response): Context {
  return {
    req,
    res,
    request: req,
    response: res,
    params: req.pathParams,
    query: req.queryParams,
    body: req.body,
    requestContext: {
      get(_identity: string) {
        return null;
      },
    },
  };
}
