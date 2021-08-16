import { Request, Response } from 'express';

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
