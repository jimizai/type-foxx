import { B } from "./B";

export class A {
  constructor(private b: B) {}

  test() {
    this.b.index();
  }
}
