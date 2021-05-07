import { FoxxDriver, KoaFoxxDriver } from "@jimizai/drivers";
import { Loader } from "@jimizai/loader";
import * as path from "path";
import { RoutesContainer } from "./routes";

interface BootstrapOptions<Middleware> {
  Driver?: FoxxDriver<Middleware>;
  port?: number;
  srcDir?: string;
  middlewares?: Middleware[];
}

//deno-lint-ignore no-explicit-any
export async function boostrap<Middleware = any>(
  options: BootstrapOptions<Middleware> = {},
) {
  const srcDir = options.srcDir || path.join(process.cwd(), "./src");
  const modules = await new Loader(srcDir).load();
  const routesInstance = new RoutesContainer(modules);
  //deno-lint-ignore no-explicit-any
  const Driver: any = options.Driver || KoaFoxxDriver;
  //deno-lint-ignore no-explicit-any
  const driver: FoxxDriver<any> = new Driver(routesInstance, {
    port: options.port || 7001,
  });
  driver.init();
}
