import { NotFoundException, BaseExceptions } from '@jimizai/common';
import { Catch } from '@jimizai/decorators';
import { Catcher } from '@jimizai/driver-types';
import { Context } from 'koa';

@Catch(NotFoundException)
export class NotFoundCatcher implements Catcher {
  catch(_error: BaseExceptions, ctx: Context) {
    ctx.body = {
      code: 404,
      data: null,
      msg: 'not found',
      timestamp: Date.now(),
    };
  }
}

@Catch()
export class ErrorCatcher implements Catcher {
  catch(_error: BaseExceptions, ctx: Context) {
    console.log('error');
    ctx.body = {
      code: 500,
      data: null,
      msg: 'server error',
      timestamp: Date.now(),
    };
  }
}
