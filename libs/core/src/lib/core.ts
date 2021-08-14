import {
  FoxxDriver,
  INJECT_SERVER_PORT,
  INJECT_FOXX_MIDDLEWARES,
  INJECT_FOXX_DRIVER,
  INJECT_SRC_DIRS,
} from '@jimizai/driver-types';
import { Container } from '@jimizai/injectable';
import { FoxxFactory } from './factory';
import * as path from 'path';

export type FoxxDriverConstructorTypeOf<T> = new (...args: any[]) => T;
interface BootstrapOptions<Middleware> {
  Driver?: FoxxDriverConstructorTypeOf<FoxxDriver>;
  port?: number;
  srcDirs?: string[] | string;
  middlewares?: Middleware[];
}

const driverList = ['@jimizai/driver-koa'];

const tryRequireDriver = async () => {
  for (const driver of driverList) {
    try {
      const module = await import(driver);
      console.log(module);
      return module[Object.keys(module)[0]];
    } catch (err) {
      console.log(err);
      continue;
    }
  }
  return null;
};

export async function boostrap<M>(options: BootstrapOptions<M>) {
  let Driver;
  if (options.Driver) {
    Driver = options.Driver;
  } else {
    Driver = await tryRequireDriver();
  }
  if (!Driver) {
    throw new Error(
      'Driver not found! Maybe you should install @jimizai/driver-koa'
    );
  }
  try {
    Container.bind(INJECT_FOXX_MIDDLEWARES, options.middlewares);
    Container.bind(INJECT_FOXX_DRIVER, Driver);
    Container.bind(
      INJECT_SRC_DIRS,
      options.srcDirs || [path.join(process.cwd(), './src')]
    );
    Container.bind(INJECT_SERVER_PORT, options.port || 7001);

    const foxxFactory = Container.factory(FoxxFactory);
    await foxxFactory.initRoutes();
    console.error();
    const instance = Container.factory<FoxxDriver>(Driver);
    instance.bootstrap();
    console.log('Foxx server started success!');
  } catch (err) {
    console.log(err);
  }
}
