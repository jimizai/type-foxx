import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { ConfigService } from './config.service';
import { Injectable, ScopeEnum } from '@jimizai/injectable';
import { Init } from '@jimizai/decorators';

@Injectable({
  scope: ScopeEnum.Singleton,
})
export class ORMService {
  public connection: Connection | null = null;

  constructor(private configService: ConfigService) {}

  @Init()
  async init() {
    const config = this.configService.get('orm');
    this.connection = await createConnection(config as ConnectionOptions);
  }
}
