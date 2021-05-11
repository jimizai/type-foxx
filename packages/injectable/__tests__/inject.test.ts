import { CLASS_DEPS, Inject, Injectable } from "../src";

@Injectable()
class B {}

@Injectable()
class CService {}

@Injectable()
class A {
  constructor(
    @Inject("b") public bService: B,
    @Inject("cService") public c: CService,
  ) {
  }
}

test("test use inject", () => {
  const deps = Reflect.getMetadata(CLASS_DEPS, A);
  expect(deps[0]).toBe("b");
  expect(deps[1]).toBe("cService");
});
