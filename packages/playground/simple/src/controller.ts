import { promisify } from "util";
import { Controller, Get } from "../../../decorators";
import { Injectable } from "../../../injectable";

const sleep = promisify(setTimeout);

@Controller()
@Injectable()
export class HomeController {
  @Get()
  async home() {
    await sleep(1000);
    return {
      code: 200,
      data: "success",
    };
  }
}
