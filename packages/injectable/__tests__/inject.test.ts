import { CLASS_DEPS, Inject, Injectable } from "../src";

const CONFIG_CONSTANTS = "CONFIG_CONSTANTS";

interface Config {
  name: string;
}

const config: Config = {
  name: "luke",
};

@Injectable()
class B {}

@Injectable()
class CService {}

@Injectable()
class A {
  constructor(
    @Inject("b") public bService: B,
    @Inject("cService") public c: CService,
    @Inject(CONFIG_CONSTANTS) public config: Config,
  ) {
  }
}

test("test use inject", () => {
  const deps = Reflect.getMetadata(CLASS_DEPS, A);
  expect(deps[0]).toBe("b");
  expect(deps[1]).toBe("cService");
});
