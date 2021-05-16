import { Context } from "koa";
import { Catch } from "../../../../decorators";
import { ExceptionFilter } from "../../../../driver-koa";
import { Injectable } from "../../../../injectable";

@Catch()
@Injectable()
export class ErrorHandler implements ExceptionFilter {
  catch(_error, ctx: Context) {
    ctx.body = {
      code: 500,
      data: null,
      msg: "server error",
      timestamp: Date.now(),
    };
  }
}
