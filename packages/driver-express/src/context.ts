import { Request, Response } from "express";

// deno-lint-ignore no-explicit-any
type Any = any;

export interface Context {
  req: Request;
  res: Response;
  request: Request;
  response: Response;
  params: Any;
  query: Any;
  body: Any;
  requestContext: { get(identity: string): Any };
}

export function extendsContext(req: Request, res: Response): Context {
  return {
    req,
    res,
    request: req,
    response: res,
    params: req.params,
    query: req.query,
    body: req.body,
    requestContext: {
      get(_identity: string) {
        return null;
      },
    },
  };
}
