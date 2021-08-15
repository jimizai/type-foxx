import { NotFoundException } from '@jimizai/common';
import { Catch } from '@jimizai/decorators';
import { Context } from 'koa';

@Catch(NotFoundException)
export class NotFoundCatcher {
  catch(_error, ctx: Context) {
    console.log('not found');
    ctx.body = {
      code: 404,
      data: null,
      msg: 'not found',
      timestamp: Date.now(),
    };
  }
}

@Catch()
export class Catcher {
  catch(_error, ctx: Context) {
    console.log('error');
    ctx.body = {
      code: 500,
      data: null,
      msg: 'server error',
      timestamp: Date.now(),
    };
  }
}
