import { Loader } from "../src";
import * as path from "path";
import { A } from "./A";
import { B } from "./B";
import C from "./C";
import { D } from "./D";
import { E } from "./E";

test("can load files", async () => {
  const targets = await new Loader(path.resolve(__dirname, "./")).load();
  expect(targets[0]).toBe(A);
  expect(targets[1]).toBe(B);
  expect(targets[2]).toBe(C);
  expect(targets[3]).toBe(D);
  expect(targets[4]).toBe(E);
});
