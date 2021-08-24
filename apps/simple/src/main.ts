import { createApp } from '@jimizai/core';
import { KoaFoxxDriver } from '@jimizai/driver-koa';
import './app/home.controller';
import './app/catcher';

async function main() {
  const app = await createApp({
    Driver: KoaFoxxDriver,
    middlewares: [],
    srcDirs: [],
  });
  app.bootstrap();
}

main();
