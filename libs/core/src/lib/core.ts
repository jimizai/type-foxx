import {
  FoxxDriver,
  INJECT_SERVER_PORT,
  INJECT_FOXX_MIDDLEWARES,
  INJECT_FOXX_DRIVER,
  INJECT_SRC_DIRS,
  INJECT_CATCHERS,
  INJECT_ROUTES,
  INJECT_OPEN_API,
  FoxxApplication,
} from '@jimizai/driver-types';
import { FactoryContainer } from '@jimizai/injectable';
import { OpenApiService } from './openApi';
import { Router } from './router';
import { CollectionFactory } from './collection';
import { FoxxApplicationImpl } from './application';
import * as path from 'path';

export type FoxxDriverConstructorTypeOf<T> = new (...args: any[]) => T;
interface BootstrapOptions<Middleware> {
  Driver?: FoxxDriverConstructorTypeOf<FoxxDriver>;
  port?: number;
  srcDirs?: string[] | string;
  middlewares?: Middleware[];
}

const driverList = ['@jimizai/driver-koa', '@jimizai/driver-express'];

const tryRequireDriver = async () => {
  for (const driver of driverList) {
    try {
      const module = await import(driver);
      return module[Object.keys(module)[0]];
    } catch (err) {
      continue;
    }
  }
  return null;
};

export async function boostrap<M>(options: BootstrapOptions<M>) {
  const instance = await createApp(options);
  instance?.bootstrap();
  process.send?.({ message: 'success' });
  console.log('Foxx server started success!');
}

export async function createApp<M>(
  options: BootstrapOptions<M>
): Promise<FoxxApplication | null> {
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
    FactoryContainer.bind(INJECT_FOXX_DRIVER, Driver);
    FactoryContainer.bind(
      INJECT_SRC_DIRS,
      options.srcDirs || [path.join(process.cwd(), './src')]
    );
    FactoryContainer.bind(INJECT_SERVER_PORT, options.port || 7001);
    // bind routes
    const router = FactoryContainer.factory(Router);
    const routes = await router.initRoutes();
    FactoryContainer.bind(INJECT_ROUTES, routes);

    // bind modules
    const collection = FactoryContainer.factory(CollectionFactory);
    FactoryContainer.bind(INJECT_CATCHERS, collection.getErrorHandlers());
    FactoryContainer.bind(INJECT_FOXX_MIDDLEWARES, [
      ...(options.middlewares || []),
      ...collection.getMiddlewares(),
    ]);
    // bind open api
    FactoryContainer.bind(
      INJECT_OPEN_API,
      FactoryContainer.factory(OpenApiService)
    );

    const application = FactoryContainer.factory(FoxxApplicationImpl);
    return application;
  } catch (err) {
    console.log(err);
    return null;
  }
}
