import { boostrap } from '@jimizai/core';
import { ExpressFoxxDriver } from '@jimizai/driver-express';
import './app/home.controller';
import './app/catcher';

boostrap({
  Driver: ExpressFoxxDriver,
  srcDirs: [],
});
