import {
  FactoryContainer,
  Injectable,
  provideDynamicData,
} from "@jimizai/injectable";
import { ConfigService, FOXX_CONFIGS } from "../src";

const config = {
  appName: "app",
};

provideDynamicData(FOXX_CONFIGS, config);

@Injectable()
class A {
  constructor(public configService: ConfigService<typeof config>) {
  }
}

test("test config service", () => {
  const factory = new FactoryContainer([A, ConfigService]);
  const a = factory.get<A>("a");
  const appName = a.configService.get("appName");
  expect(appName).toBe("app");
});
