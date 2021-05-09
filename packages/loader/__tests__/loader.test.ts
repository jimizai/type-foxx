import * as path from "path";
import { Loader } from "../src";
import { F } from "./modules/F";
import { A } from "./services/A";
import { B } from "./services/B";
import C from "./services/C";
import { D } from "./services/D";
import { E } from "./services/E";

test("can load files", async () => {
  const targets = await new Loader(path.resolve(__dirname, "./modules"))
    .load();
  expect(targets[0]).toBe(F);
});

test("support srcDirs", async () => {
  const targets = await new Loader([
    path.resolve(__dirname, "./services"),
    path.resolve(__dirname, "./modules"),
  ])
    .load();
  expect(targets[0]).toBe(A);
  expect(targets[1]).toBe(B);
  expect(targets[2]).toBe(C);
  expect(targets[3]).toBe(D);
  expect(targets[4]).toBe(E);
  expect(targets[5]).toBe(F);
});
