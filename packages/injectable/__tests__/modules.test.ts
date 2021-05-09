import { Injectable } from "../src";
import { FactoryContainer } from "../src/factory";

@Injectable()
class B {
}

@Injectable()
class C {
}

@Injectable()
class D {
}

@Injectable()
class A {
  constructor(public b: B, public c: C, public d: D) {}
  test() {
  }
}

test("should set modules", () => {
  const factory = new FactoryContainer([A, B, C, D]);
  const a: A = factory.get("a");
  expect(a.b instanceof B).toBe(true);
  expect(a.c instanceof C).toBe(true);
  expect(a.d instanceof D).toBe(true);
});
