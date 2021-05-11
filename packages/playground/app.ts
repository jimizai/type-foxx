import * as path from "path";
import { ConfigModule } from "../config";
import { boostrap } from "../core/src";
import { Module } from "../decorators";
import configs from "./src/configs/config.default";
import { errorHandler } from "./src/middlewares/errorHandler";
@Module({ srcDir: path.resolve(__dirname, "./services") })
class ServiceModule {}

@Module({ srcDir: path.resolve(__dirname, "./src") })
class AppModule {}

boostrap({
  modules: [AppModule, ServiceModule, ConfigModule.register(configs)],
  middlewares: [errorHandler],
});
