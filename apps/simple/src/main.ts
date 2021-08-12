import { boostrap } from '@jimizai/core';
import { KoaFoxxDriver } from '@jimizai/driver-koa';
import './app/home.controller';

boostrap({
  Driver: KoaFoxxDriver,
  srcDirs: [],
});
