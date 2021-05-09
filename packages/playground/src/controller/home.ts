import { Context } from "koa";
import { Controller, Ctx, Get } from "../../../decorators";
import { Injectable } from "../../../injectable";
import { DataService } from "../../services/data";

@Injectable()
@Controller()
export class HomeController {
  constructor(private dataService: DataService) {}

  @Get()
  home() {
    return {
      code: 200,
      data: this.dataService.getData(),
      msg: "success",
      timestamp: Date.now(),
    };
  }

  @Get("/ttt")
  test(@Ctx() ctx: Context) {
    ctx.body = {
      code: 200,
      data: "hello test",
      msg: "success",
      timestamp: Date.now(),
    };
  }
}
