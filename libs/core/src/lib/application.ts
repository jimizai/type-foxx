import { Driver } from '@jimizai/decorators';
import {
  FoxxApplication,
  INJECT_FOXX_DRIVER,
  FoxxDriver,
} from '@jimizai/driver-types';
import { FactoryContainer, Inject } from '@jimizai/injectable';

@Driver()
export class FoxxApplicationImpl implements FoxxApplication {
  constructor(@Inject(INJECT_FOXX_DRIVER) private driver: FoxxDriver) {}

  get<T>(target: { new (...args: any[]): T }): T {
    return FactoryContainer.factory<T>(target);
  }

  bootstrap(): void {
    this.driver.bootstrap();
  }
}