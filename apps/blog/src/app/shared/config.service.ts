import { Inject, Injectable } from '@jimizai/injectable';
import { INJECT_CONFIG } from '@blog/constants';
import { FoxxConfig } from '@blog/config';

@Injectable()
export class ConfigService {
  constructor(@Inject(INJECT_CONFIG) private configs: FoxxConfig) {}

  get<T extends keyof FoxxConfig>(key: T): FoxxConfig[T] {
    return this.configs[key];
  }
}
