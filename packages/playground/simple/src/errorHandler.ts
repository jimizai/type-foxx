import { Catch } from "../../../decorators";
import { Injectable } from "../../../injectable";

@Catch()
@Injectable()
export class ErrorHandler {
  catch(_error, ctx) {
    ctx.body = {
      code: 400,
      message: "Bad Request",
    };
  }
}
