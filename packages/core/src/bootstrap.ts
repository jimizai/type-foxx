import { Loader } from "@jimizai/loader";
import * as path from "path";
import { RoutesContainer } from "./routes";

export async function boostrap() {
  const srcDir = path.join(__dirname, "./src");
  const modules = await new Loader(srcDir).load();
  const _factory = new RoutesContainer(modules);
}
