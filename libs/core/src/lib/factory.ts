import { Injectable, Inject, Container } from '@jimizai/injectable';
import { INJECT_FOXX_DRIVER, INJECT_ROUTES } from '@jimizai/driver-types';
import { RoutesFactoryContainer } from './routes';
import { FoxxDriver } from '@jimizai/driver-types';

@Injectable()
export class FoxxFactory {
  constructor(
    @Inject(INJECT_FOXX_DRIVER) private driver: FoxxDriver,
    private routesFactoryContainer: RoutesFactoryContainer
  ) {}

  async initRoutes() {
    const routes = await this.routesFactoryContainer.initRoutes();
    Container.bind(INJECT_ROUTES, routes);
  }

  bootstrap() {
    this.driver.bootstrap();
  }
}
