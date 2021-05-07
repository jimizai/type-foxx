import { Controller, Get } from "../../../decorators";
import { Injectable } from "../../../injectable";
import { TestService } from "../services/TestService";

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

@Injectable()
@Controller()
export class HomeController {
  constructor(private testService: TestService) {}

  @Get()
  async home() {
    await sleep(2000);
    return {
      code: 200,
      data: this.testService.add(1, 2),
      msg: "success",
      timestamp: Date.now(),
    };
  }
}
