import { boostrap } from '@jimizai/core';
import { KoaFoxxDriver } from '@jimizai/driver-koa';
import * as path from 'path';

boostrap({
  Driver: KoaFoxxDriver,
  srcDirs: [path.resolve(process.cwd(), 'apps/simple/src/app')],
});
