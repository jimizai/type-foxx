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

@Catch()
export class ExceptionImpl implements Catcher {
  catch(error, ctx) {
    console.log(error);
    ctx.body = {
      code: 500,
      data: null,
      msg: 'Internal server error',
      timestamp: Date.now(),
    };
  }
}
