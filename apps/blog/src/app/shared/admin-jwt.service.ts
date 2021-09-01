import { JWTService } from '@jimizai/jwt';
import { Injectable } from '@jimizai/injectable';
import { FoxxConfig } from '@/config';

@Injectable()
export class AdminJWTService extends JWTService<FoxxConfig> {
  override get secret() {
    return this.configService.get('jwt').adminSecret;
  }
}
