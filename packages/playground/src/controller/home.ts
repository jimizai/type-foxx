import { Context } from "koa";
import { ConfigService } from "../../../config";
import { Controller, Ctx, Get } from "../../../decorators";
import { Injectable } from "../../../injectable";
import { DataService } from "../../services/data";
import configs from "../configs/config.default";

@Injectable()
@Controller()
export class HomeController {
  constructor(
    private dataService: DataService,
    private configService: ConfigService<typeof configs>,
  ) {}

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

  @Get("/config")
  config() {
    console.log(this.configService);
    return {
      code: 200,
      data: this.configService.get("appName"),
      msg: "success",
      timestamp: Date.now(),
    };
  }
}
