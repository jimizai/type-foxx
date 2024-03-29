import { Inject } from '@jimizai/injectable';
import { Context, Request } from 'koa';

export interface ResponseData {
  code: number;
  data: any;
  msg: string;
  time: number;
  total?: number;
}

export abstract class BaseController {
  private status = 200;
  private data: any = null;
  private msg = 'success';
  private total = null;

  @Inject()
  public ctx: Context;

  @Inject()
  public request: Request;

  setStatus(status: number): BaseController {
    this.status = status;
    return this;
  }

  setData(data: any): BaseController {
    this.data = data;
    return this;
  }

  setMessage(msg: string): BaseController {
    this.msg = msg;
    return this;
  }

  setTotal(total: number): BaseController {
    this.total = total;
    return this;
  }

  succeed(msg?: string) {
    const res: ResponseData = {
      code: this.status,
      data: this.data,
      msg: msg || this.msg,
      time: Date.now(),
    };
    if (typeof this.total === 'number') {
      res.total = this.total;
    }
    this.ctx.body = res;
  }
}
