import { DynamicModule } from "@jimizai/decorators";
import { FoxxDriver, KoaFoxxDriver } from "@jimizai/drivers";
import { CLASS_METADATA } from "@jimizai/injectable";
import { Loader } from "@jimizai/loader";
import * as path from "path";
import { ModuleLoader } from "./module";
import { RoutesContainer } from "./routes";
import { isFunction, toArray } from "./utils";
import ora = require("ora");

interface BootstrapOptions<Middleware> {
  Driver?: FoxxDriver<Middleware>;
  port?: number;
  srcDirs?: string[] | string;
  middlewares?: Middleware[];
  // deno-lint-ignore ban-types
  module?: (Function | DynamicModule);
}

//deno-lint-ignore no-explicit-any
export async function boostrap<Middleware = any>(
  options: BootstrapOptions<Middleware> = {},
) {
  const spinner = ora("Foxx server starting..").start();
  try {
    const dirs = toArray(options.srcDirs);
    let moduleDirs = [];
    let moduleProviders = [];
    if (options.module) {
      const moduleContainer = new ModuleLoader(options.module);
      moduleDirs = moduleContainer.getSrcDirs();
      moduleProviders = moduleContainer.getProviders();
    }

    let srcDirs: string[] = [...dirs, ...moduleDirs].filter(Boolean);
    if (!srcDirs.length) {
      srcDirs = [path.join(process.cwd(), "./src")];
    }
    const m = await new Loader(srcDirs).load();
    const injectableModulesObject = (m.filter((module) =>
      isFunction(module) && Reflect.getMetadata(CLASS_METADATA, module)
    ).reduce(
      (prev, target) => ({ ...prev, [target.name]: target }),
      //deno-lint-ignore ban-types
      {} as Record<string, Function>,
    ));

    const injectableModules = Object.keys(injectableModulesObject).map((key) =>
      injectableModulesObject[key]
    );
    const routesInstance = new RoutesContainer(
      injectableModules,
      moduleProviders,
    );
    //deno-lint-ignore no-explicit-any
    const Driver: any = options.Driver || KoaFoxxDriver;
    const driver: FoxxDriver<Middleware> = new Driver(routesInstance, {
      port: options.port || 7001,
    });
    driver.useMiddlewares(options.middlewares || []);
    spinner.text = "Foxx server started success!";
    spinner.succeed();
    driver.init();
  } catch (err) {
    console.log(err);
    spinner.text = "Foxx server started error!";
    spinner.fail();
  }
}
