import { CanActivate } from '@jimizai/decorators';
import { Injectable } from '@jimizai/injectable';
import { Context } from 'koa';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: Context): boolean {
    console.log(ctx);
    return false;
  }
}
