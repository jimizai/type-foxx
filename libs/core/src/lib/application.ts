import { Driver } from '@jimizai/decorators';
import {
  FoxxApplication,
  INJECT_FOXX_DRIVER,
  FoxxDriver,
} from '@jimizai/driver-types';
import { FactoryContainer, Inject } from '@jimizai/injectable';
import { PipeTransform, CanActivate } from '@jimizai/decorators';

@Driver()
export class FoxxApplicationImpl implements FoxxApplication {
  constructor(@Inject(INJECT_FOXX_DRIVER) private driver: FoxxDriver) {}
  private pipes: PipeTransform[];
  private guards: CanActivate[] = [];

  get<T>(target: { new (...args: any[]): T }): T {
    return FactoryContainer.factory<T>(target);
  }

  useGlobalPipes(...pipes: PipeTransform[]) {
    this.pipes = pipes;
  }

  getGlobalPipes() {
    return this.pipes;
  }

  useGlobalGuards(...guards: CanActivate[]) {
    this.guards = guards;
  }

  getGlobalGuards() {
    return this.guards;
  }

  bootstrap(): void {
    this.driver.bootstrap();
  }
}
