import { Controller, Get, Query } from "../../../decorators";
import { Injectable } from "../../../injectable";
import { TestService } from "../services/TestService";

@Injectable()
@Controller()
export class HomeController {
  constructor(private testService: TestService) {}

  @Get()
  home(@Query("id") id: string) {
    console.log("id", id);
    return {
      code: 200,
      data: this.testService.add(1, 2),
      msg: "success",
      timestamp: Date.now(),
    };
  }
}
