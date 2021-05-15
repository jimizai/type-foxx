import * as path from "path";
import { ConfigModule } from "../../config";
import { boostrap } from "../../core";
import { Module } from "../../decorators";
import configs from "./src/configs/config.default";
import { errorHandler } from "./src/middlewares/errorHandler";
@Module({ srcDirs: path.resolve(__dirname, "./services") })
class ServiceModule {}

@Module({
  srcDirs: path.resolve(__dirname, "./src"),
  modules: [ServiceModule, ConfigModule.register(configs)],
})
class AppModule {}

boostrap({
  module: AppModule,
  middlewares: [errorHandler],
});
