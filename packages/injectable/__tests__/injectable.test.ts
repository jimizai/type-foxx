import { Injectable } from "../src";
import { ModuleContainer } from "../src/container";
import { FactoryContainer } from "../src/factory";
import { CLASS_DEPS } from "../src/constants";

@Injectable()
export class B {
  b = 12;

  index() {
    console.log("this is a b");
  }
}

@Injectable()
class A {
  constructor(public b: B) {}
  test() {
    this.b.index();
  }
}

const equalModule = (target: any, name: string) => {
  expect(target).toBeInstanceOf(Function);
  expect(target.name).toBe(name);
};

test("should set modules", () => {
  const moduleA = ModuleContainer.modules["A"];
  const moduleB = ModuleContainer.modules["B"];
  equalModule(moduleA, "A");
  equalModule(moduleB, "B");
});

test("should set deps", () => {
  const deps = Reflect.getMetadata(CLASS_DEPS, A);
  expect(deps[0]).toBe("b");
});

test("factory container", () => {
  const targets = [A, B];
  const factory = new FactoryContainer(targets);
  const instanceA = factory.get<A>("a");
  expect(instanceA.b.b).toBe(12);
});
