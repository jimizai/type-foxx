import * as path from "path";
import { boostrap } from "../core";
import { Module } from "../decorators";
import { errorHandler } from "./src/middlewares/errorHandler";
@Module({ srcDir: path.resolve(__dirname, "./services") })
class ServiceModule {}

@Module({ srcDir: path.resolve(__dirname, "./src") })
class AppModule {}

boostrap({
  modules: [AppModule, ServiceModule],
  middlewares: [errorHandler],
});
