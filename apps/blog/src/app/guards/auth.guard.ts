import { CanActivate } from '@jimizai/decorators';
import { Inject, Injectable } from '@jimizai/injectable';
import { BaseExceptions } from '@jimizai/common';
import { JWTService } from '@jimizai/jwt';
import { Context } from 'koa';
import { FoxxConfig } from '@/config';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  jWTService: JWTService<FoxxConfig>;

  async canActivate(ctx: Context): Promise<boolean> {
    try {
      await this.jWTService.verify(ctx.headers.authorization);
    } catch {
      throw new BaseExceptions('Forbidden', 403, 'Permission denied');
    }
    return true;
  }
}
