import { FoxxDriver, KoaFoxxDriver } from "@jimizai/drivers";
import { Loader } from "@jimizai/loader";
import * as path from "path";
import { RoutesContainer } from "./routes";

interface BootstrapOptions {
  //deno-lint-ignore no-explicit-any
  Driver?: FoxxDriver<any>;
  port?: number;
  srcDir?: string;
}

export async function boostrap(options: BootstrapOptions = {}) {
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
