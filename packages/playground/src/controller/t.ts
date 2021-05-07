import { Controller, Get } from "../../../decorators";
import { Injectable } from "../../../injectable";

@Injectable()
@Controller("/test")
export class TestController {
  @Get("/")
  test() {
    return {
      code: 200,
      msg: "success",
    };
  }
}
