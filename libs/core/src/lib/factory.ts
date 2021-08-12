import { Injectable, Container } from '@jimizai/injectable';
import { INJECT_ROUTES } from '@jimizai/driver-types';
import { RoutesFactoryContainer } from './routes';

@Injectable()
export class FoxxFactory {
  constructor(private routesFactoryContainer: RoutesFactoryContainer) {}

  async initRoutes() {
    const routes = await this.routesFactoryContainer.initRoutes();
    Container.bind(INJECT_ROUTES, routes);
  }
}
