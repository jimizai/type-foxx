import { createApp } from '@jimizai/core';
import { KoaFoxxDriver } from '@jimizai/driver-koa';
import { ORMService } from '@blog/app/shared/orm.service';
import { CurdService } from '@blog/app/shared/curd';
import '@blog/app/exceptions';
import '@blog/app/modules';

async function main() {
  const app = await createApp({
    Driver: KoaFoxxDriver,
    middlewares: [],
    srcDirs: [],
  });

  app.get(ORMService);
  app.get(CurdService);
  app.bootstrap();
}

main();
