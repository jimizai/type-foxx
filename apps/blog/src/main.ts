import { createApp } from '@jimizai/core';
import { KoaFoxxDriver } from '@jimizai/driver-koa';
import { ORMService } from '@app/shared/orm.service';
import '@app/exceptions';
import '@app/modules';
import './config';

async function main() {
  const app = await createApp({
    Driver: KoaFoxxDriver,
    middlewares: [],
    srcDirs: [],
  });

  app.get(ORMService);
  app.bootstrap();
}

main();
