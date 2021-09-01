import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { ConfigService } from '@jimizai/config';
import { Injectable, ScopeEnum } from '@jimizai/injectable';
import { Init } from '@jimizai/decorators';
import { FoxxConfig } from '@/config';

@Injectable({
  scope: ScopeEnum.Singleton,
})
export class ORMService {
  public connection: Connection | null = null;

  constructor(private configService: ConfigService<FoxxConfig>) {}

  @Init()
  async init() {
    const config = this.configService.get('orm');
    this.connection = await createConnection(config as ConnectionOptions);
  }
}
