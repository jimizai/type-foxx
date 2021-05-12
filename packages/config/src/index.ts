import { DynamicModule } from "@jimizai/decorators";
import { resolve } from "path";
import { FOXX_CONFIGS } from "./constants";

export * from "./service";
export { FOXX_CONFIGS };

export class ConfigModule {
  //deno-lint-ignore no-explicit-any
  static register(configs: any): DynamicModule {
    return {
      srcDirs: resolve(__dirname, "./"),
      providers: [
        {
          provide: FOXX_CONFIGS,
          useValues: configs,
        },
      ],
    };
  }
}
