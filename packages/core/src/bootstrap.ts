import { MODULE_METADATA, ModuleOptions } from "@jimizai/decorators";
import { FoxxDriver, KoaFoxxDriver } from "@jimizai/drivers";
import { CLASS_METADATA } from "@jimizai/injectable";
import { Loader } from "@jimizai/loader";
import * as path from "path";
import { RoutesContainer } from "./routes";
import ora = require("ora");

interface BootstrapOptions<Middleware> {
  Driver?: FoxxDriver<Middleware>;
  port?: number;
  srcDirs?: string[] | string;
  middlewares?: Middleware[];
  // deno-lint-ignore ban-types
  modules?: Function[];
}

const toArray = <T>(arr: T | T[]): T[] => Array.isArray(arr) ? arr : [arr];

//deno-lint-ignore no-explicit-any
export async function boostrap<Middleware = any>(
  options: BootstrapOptions<Middleware> = {},
) {
  const spinner = ora("Foxx server starting..").start();
  const dirs = toArray(options.srcDirs);
  const moduleDirs = (options.modules || []).map((target) =>
    (Reflect.getMetadata(MODULE_METADATA, target) as ModuleOptions)?.srcDir ||
    ""
  ).filter(Boolean);
  let srcDirs: string[] = [...dirs, ...moduleDirs];
  if (!srcDirs.length) {
    srcDirs = [path.join(process.cwd(), "./src")];
  }
  const m = await new Loader(srcDirs).load();
  const injectableModules = m.filter((module) =>
    Reflect.getMetadata(CLASS_METADATA, module)
  );
  const routesInstance = new RoutesContainer(injectableModules);
  //deno-lint-ignore no-explicit-any
  const Driver: any = options.Driver || KoaFoxxDriver;
  const driver: FoxxDriver<Middleware> = new Driver(routesInstance, {
    port: options.port || 7001,
  });
  driver.useMiddlewares(options.middlewares || []);
  spinner.text = "Foxx server started success!";
  spinner.succeed();
  driver.init();
}
