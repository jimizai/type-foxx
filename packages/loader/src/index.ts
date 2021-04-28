import glob from "glob";
import * as path from "path";

const FILE_PETTERNS = "**/*.?(ts|js)";

export class Loader {
  constructor(private srcDir: string) {}

  // deno-lint-ignore no-explicit-any
  load(): Promise<any[]> {
    return new Promise((resolve) => {
      const filePatterns = path.join(this.srcDir, FILE_PETTERNS);
      glob(filePatterns, {}, (_, files) => {
        resolve(
          files
            .map((file) => {
              const module = require(file);
              return Object.keys(module).map((key) => module[key]);
            })
            .flat(),
        );
      });
    });
  }
}
