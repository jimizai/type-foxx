import {
  Arg,
  METHOD_METADATA,
  PARAM_METADATA,
  PATH_METADATA,
} from "@jimizai/decorators";
import { FactoryContainer } from "@jimizai/injectable";
import * as path from "path";

export interface Route {
  method: string;
  url: string;
  args: Arg[];
}

export class RoutesContainer extends FactoryContainer {
  protected routes: Route[] = [];

  //deno-lint-ignore no-explicit-any
  constructor(targets: any[]) {
    super(targets);
    this.initRoutes();
  }

  getRoutes() {
    return this.routes;
  }

  initRoutes() {
    Object.keys(this.modules).map((key) => {
      const module = this.modules[key];
      const prefixPath = Reflect.getMetadata(PATH_METADATA, module.target);
      if (prefixPath) {
        const descriptors =
          (Object.getOwnPropertyDescriptors(module.target.prototype));
        for (const index in Object.keys(descriptors)) {
          const methodName = Object.keys(descriptors)[index];
          if (methodName === "constructor") {
            continue;
          }
          const func = descriptors[methodName].value;
          const url = Reflect.getMetadata(PATH_METADATA, func);
          const method = Reflect.getMetadata(METHOD_METADATA, func);
          const args = Reflect.getMetadata(PARAM_METADATA, func);
          if (url && method) {
            this.routes.push({
              method,
              url: path.join(prefixPath, url),
              args: args.sort((x, y) => x.parameterIndex - y.parameterIndex),
            });
          }
        }
      }
    });
  }
}
