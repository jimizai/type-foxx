import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { ConfigService } from './config.service';
import { Injectable } from '@jimizai/injectable';
import { Init } from '@jimizai/decorators';

@Injectable({
  providedIn: 'root',
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
