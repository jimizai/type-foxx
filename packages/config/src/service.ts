import { Inject, Injectable } from "@jimizai/injectable";
import { FOXX_CONFIGS } from "./constants";
import { ConfigServiceException } from "./exception";

@Injectable()
//deno-lint-ignore no-explicit-any
export class ConfigService<T = Record<string, any>> {
  constructor(@Inject(FOXX_CONFIGS) public config: T) {
  }

  get<K extends keyof T>(key?: K): T[K] {
    if (!this.config) {
      throw new ConfigServiceException(
        "must use function provideDynamicData to provide config data before start server",
      );
    }
    return this.config[key];
  }
}
