import { createApp } from '@jimizai/core';
import { KoaFoxxDriver } from '@jimizai/driver-koa';
import { ORMService } from '@app/shared/orm.service';
import { CurdService } from '@app/shared/curd';
import '@app/exceptions';
import '@app/modules';

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
