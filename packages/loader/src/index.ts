import * as path from "path";
const glob = require("glob");

const FILE_PETTERNS = "**/*.?(ts|js)";

const globSync = (url: string) =>
  new Promise((resolve, reject) => {
    glob(path.join(url, FILE_PETTERNS), {}, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(
        files.filter((file) => !~file.indexOf(".d.ts")),
      );
    });
  });

export class Loader {
  constructor(private srcDir: string[] | string) {}

  getSrcDirs(): string[] {
    return Array.isArray(this.srcDir) ? this.srcDir : [this.srcDir];
  }

  async getFiles(): Promise<string[]> {
    const files =
      (await Promise.all(this.getSrcDirs().map((src) => globSync(src))))
        .flat() as string[];
    return [...new Set(files)];
  }

  // deno-lint-ignore no-explicit-any
  async load(): Promise<any[]> {
    const files = await this.getFiles();
    return files
      .map((file) => {
        const module = require(file);
        return Object.keys(module).map((key) => module[key]);
      })
      .flat();
  }
}
