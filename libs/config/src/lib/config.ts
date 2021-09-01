import { Inject, Injectable, ScopeEnum } from '@jimizai/injectable';
import { INJECT_CONFIG } from './constants';

@Injectable({ scope: ScopeEnum.Singleton })
export class ConfigService<C> {
  constructor(@Inject(INJECT_CONFIG) private configs: C) {
    //
  }

  get<T extends keyof C>(key: T): C[T] {
    return this.configs[key];
  }
}
