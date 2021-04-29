import { Injectable } from "../src";
import { FactoryContainer } from "../src/factory";

@Injectable()
class A {
  constructor(_b: B) {
  }
}

@Injectable()
class B {
  constructor(_a: A) {}
}

test("circular dependency DI", () => {
  try {
    new FactoryContainer([A, B]);
  } catch (err) {
    expect(err.name).toBe("CircularDependencyDIException");
  }
});
