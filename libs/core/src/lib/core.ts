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

export async function boostrap<M>(options: BootstrapOptions<M>) {
  try {
    Container.bind(INJECT_FOXX_MIDDLEWARES, options.middlewares);
    Container.bind(INJECT_FOXX_DRIVER, options.Driver);
    Container.bind(
      INJECT_SRC_DIRS,
      options.srcDirs || [path.join(process.cwd(), './src')]
    );
    Container.bind(INJECT_SERVER_PORT, options.port || 7001);
    const driverInstance = Container.factory(FoxxFactory);
    await driverInstance.initRoutes();
    console.log('Foxx server started success!');
    driverInstance.bootstrap();
  } catch (err) {
    console.log(err);
  }
}