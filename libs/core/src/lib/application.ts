import {
  FoxxApplication,
  OpenApi,
  INJECT_FOXX_DRIVER,
  FoxxDriver,
  INJECT_OPEN_API,
} from '@jimizai/driver-types';
import { Inject, Injectable } from '@jimizai/injectable';

@Injectable({ providedIn: 'root' })
export class FoxxApplicationImpl implements FoxxApplication {
  constructor(
    @Inject(INJECT_FOXX_DRIVER) private driver: FoxxDriver,
    @Inject(INJECT_OPEN_API) private openApi: OpenApi
  ) {}

  get<T>(identity: string): T {
    return this.openApi.get(identity);
  }

  bootstrap(): void {
    this.driver.bootstrap();
  }
}
