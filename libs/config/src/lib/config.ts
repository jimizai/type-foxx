import { Inject, Injectable } from '@jimizai/injectable';
import { INJECT_CONFIG } from './constants';

@Injectable()
export class ConfigService<C> {
  constructor(@Inject(INJECT_CONFIG) private configs: C) {
    //
  }

  get<T extends keyof C>(key: T): C[T] {
    return this.configs[key];
  }
}
