import { CanActivate } from '@jimizai/decorators';
import { Inject, Injectable } from '@jimizai/injectable';
import { BaseExceptions } from '@jimizai/common';
import { Context } from 'koa';
import { AdminJWTService } from '@app/shared/admin-jwt.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  @Inject()
  adminJWTService: AdminJWTService;

  async canActivate(ctx: Context): Promise<boolean> {
    try {
      await this.adminJWTService.verify(ctx.headers.authorization);
    } catch {
      throw new BaseExceptions('Forbidden', 403, 'Permission denied');
    }
    return true;
  }
}
