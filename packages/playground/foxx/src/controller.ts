import { Controller, Get } from "../../../decorators";
import { Injectable } from "../../../injectable";

@Controller()
@Injectable()
export class HomeController {
  @Get()
  home() {
    return {
      code: 200,
      data: "success",
    };
  }
}
