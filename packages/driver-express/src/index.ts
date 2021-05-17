export * from "./driver";
import { Context } from "./context";

//deno-lint-ignore no-explicit-any
export interface ExceptionFilter<T = any> {
  catch(exception: T, ctx: Context): void;
}
