import { Context } from "koa";
export * from "./driver";

// deno-lint-ignore no-explicit-any
export interface ExceptionFilter<T = any> {
  catch(exception: T, ctx: Context): void;
}
