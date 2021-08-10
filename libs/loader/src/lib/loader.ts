import { Injectable } from '@jimizai/injectable';
import * as path from 'path';
import { toArray } from '@jimizai/utils';
import glob from 'glob';

const FILE_PETTERNS = '**/*.?(ts|js)';

const globSync = (url: string) =>
  new Promise((resolve, reject) => {
    glob(path.join(url, FILE_PETTERNS), {}, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files.filter((file) => !~file.indexOf('.d.ts')));
    });
  });

@Injectable()
export class Loader {
  async getFiles(srcDirs: string[]): Promise<string[]> {
    const files = (
      await Promise.all(srcDirs.map((src) => globSync(src)))
    ).flat() as string[];
    return [...new Set(files)];
  }

  async load(srcDir: string[] | string): Promise<any[]> {
    const srcDirs = toArray(srcDir);
    const files = await this.getFiles(srcDirs);
    return files
      .map(async (file) => {
        // eslint-disable-next-line
        const module = require(file);
        return Object.keys(module).map((key) => module[key]);
      })
      .flat();
  }
}
