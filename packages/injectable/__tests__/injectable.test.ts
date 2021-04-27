import { Injectable } from "../src";
import { ModuleContainer } from "../src/container";
import { CLASS_DEPS } from "../src/constants";

@Injectable()
export class B {
  index() {
    console.log("this is a b");
  }
}

@Injectable()
class A {
  constructor(private b: B) {}
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
