import { Inject, Injectable } from '@jimizai/injectable';
import { INJECT_CONFIG } from '@/constants';
import { FoxxConfig } from '@/config';

@Injectable()
export class ConfigService {
  constructor(@Inject(INJECT_CONFIG) private configs: FoxxConfig) {
    //
  }

  get<T extends keyof FoxxConfig>(key: T): FoxxConfig[T] {
    return this.configs[key];
  }
}
