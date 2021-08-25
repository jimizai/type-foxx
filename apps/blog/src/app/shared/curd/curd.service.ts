import { Inject } from '@jimizai/injectable';
import { INJECT_ROUTES, Route } from '@jimizai/driver-types';
import { Init } from '@jimizai/decorators';

export class CurdService {
  constructor(@Inject(INJECT_ROUTES) private routes: Route[]) {}

  @Init()
  CurdService() {
    console.log(this.routes);
  }
}
