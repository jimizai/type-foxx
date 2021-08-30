import { Inject, Injectable } from '@jimizai/injectable';
import { INJECT_ROUTES, Route } from '@jimizai/driver-types';
import { Init } from '@jimizai/decorators';

@Injectable()
export class CurdService {
  constructor(@Inject(INJECT_ROUTES) private routes: Route[]) {}

  @Init()
  CurdService() {
    //
  }
}
