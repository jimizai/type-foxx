import { NotFoundException, BaseExceptions } from '@jimizai/common';
import { Catch } from '@jimizai/decorators';
import { Catcher } from '@jimizai/driver-types';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundCatcher implements Catcher {
  catch(_error: BaseExceptions, _req: Request, res: Response) {
    res.send({
      code: 404,
      data: null,
      msg: 'not found',
      timestamp: Date.now(),
    });
  }
}

@Catch()
export class ErrorCatcher implements Catcher {
  catch(_error: BaseExceptions, _req: Request, res: Response) {
    console.log('error');
    res.send({
      code: 500,
      data: null,
      msg: 'server error',
      timestamp: Date.now(),
    });
  }
}
