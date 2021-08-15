import { boostrap } from '@jimizai/core';
import { KoaFoxxDriver } from '@jimizai/driver-koa';
import './app/home.controller';
import './app/catcher';

boostrap({
  Driver: KoaFoxxDriver,
  srcDirs: [],
});
