import { boostrap } from "@jimizai/core";
import { TypeFoxxDriver } from "@jimizai/driver-foxx";
import * as path from "path";

boostrap({
  Driver: TypeFoxxDriver,
  srcDirs: [path.resolve(__dirname, "./")],
});
