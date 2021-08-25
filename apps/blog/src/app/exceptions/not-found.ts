import { Catch } from '@jimizai/decorators';
import { NotFoundException } from '@jimizai/common';
import { Catcher } from '@jimizai/driver-types';

@Catch(NotFoundException)
export class NotFoundExceptionImpl implements Catcher {
  catch(_error, ctx) {
    ctx.body = {
      code: 404,
      data: null,
      msg: 'not found',
      timestamp: Date.now(),
    };
  }
}
