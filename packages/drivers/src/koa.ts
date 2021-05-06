import { Route } from "@jimizai/core";
import { Middleware } from "koa";

const Koa = require("koa");
const Router = require("koa-router");

export interface KoaDriverOptions {
  port?: number;
}

const defaultDriverOptions: KoaDriverOptions = {
  port: 7001,
};

export class KoaDriver {
  public instance: typeof Koa;
  public routerInstance: typeof Router;
  public middlewares: Middleware[] = [];

  constructor(private options: KoaDriverOptions = defaultDriverOptions) {
    this.instance = new Koa();
    this.routerInstance = new Router();
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  useRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.routerInstance[route.method](route.url, (ctx) => {
      });
    });
    this.use(this.routerInstance.routes()).use(
      this.routerInstance.allowedMethods(),
    );
    return this;
  }

  listen() {
    this.middlewares.forEach((middleware) => this.instance.use(middleware));

    this.instance.listen(this.options.port, () => {
      console.log("server started on http://localhost:" + this.options.port);
    });
  }
}
