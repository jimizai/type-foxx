import { boostrap } from "../../core";
import { ExpressFoxxDriver } from "../../driver-express";

boostrap({
  // deno-lint-ignore no-explicit-any
  Driver: ExpressFoxxDriver as any,
});
