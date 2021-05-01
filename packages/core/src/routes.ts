import { METHOD_METADATA, PATH_METADATA } from "@jimizai/decorators";
import { FactoryContainer } from "@jimizai/injectable";
import * as path from "path";

interface Route {
  method: string;
  url: string;
  args: string[];
}

export class RoutesContainer extends FactoryContainer {
  protected routes: Route[];

  //deno-lint-ignore no-explicit-any
  constructor(targets: any[]) {
    super(targets);
    this.initRoutes();
  }

  initRoutes() {
    Object.keys(this.modules).map((key) => {
      const module = this.modules[key];
      const prefixPath = Reflect.getMetadata(PATH_METADATA, module.target);
      if (prefixPath) {
        const descriptors =
          (Object.getOwnPropertyDescriptors(module.target.prototype));
        for (const methodName in Object.keys(descriptors)) {
          if (methodName === "constructor") {
            continue;
          }
          const func = descriptors[methodName].value;
          const url = Reflect.getMetadata(PATH_METADATA, func);
          const method = Reflect.getMetadata(METHOD_METADATA, func);
          if (url && method) {
            this.routes.push({
              method,
              url: path.join(prefixPath, url),
              args: [],
            });
          }
        }
      }
    });
  }
}
