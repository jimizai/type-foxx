import {
  Arg,
  METHOD_METADATA,
  PARAM_METADATA,
  PATH_METADATA,
} from "@jimizai/decorators";
import * as path from "path";
import { ExceptionHandlerContainer } from "./exceptions";

export interface Route {
  method: string;
  url: string;
  funcName: string;
  identity: string;
  args: Arg[];
}

export class RoutesContainer extends ExceptionHandlerContainer {
  protected routes: Route[] = [];

  constructor(
    //deno-lint-ignore no-explicit-any
    targets: any[],
    //deno-lint-ignore no-explicit-any
    providers: { provide: string; useValues: any }[] = [],
  ) {
    super(targets, providers);
    this.initRoutes();
  }

  getRoutes() {
    return this.routes;
  }

  initRoutes() {
    Object.keys(this.modules).map((key) => {
      const module = this.modules[key];
      const prefixPath = Reflect.getMetadata(PATH_METADATA, module.target);
      if (!prefixPath) return;
      if (prefixPath) {
        const descriptors =
          (Object.getOwnPropertyDescriptors(module.target.prototype));
        const methodKeys = Object.keys(descriptors);
        for (const index in methodKeys) {
          const methodName = methodKeys[index];
          if (methodName === "constructor") {
            continue;
          }
          const func = descriptors[methodName].value;
          let url = Reflect.getMetadata(PATH_METADATA, func) || "/";
          const method = Reflect.getMetadata(METHOD_METADATA, func);
          const args = Reflect.getMetadata(PARAM_METADATA, func) || [];
          if (url === "/") {
            url = "";
          }
          url += "(/.+)?";
          if (url && method) {
            this.routes.push({
              method,
              url: path.join(prefixPath, url),
              args: args.sort((x, y) => x.parameterIndex - y.parameterIndex),
              funcName: methodName,
              identity: key,
            });
          }
        }
      }
    });
  }
}
