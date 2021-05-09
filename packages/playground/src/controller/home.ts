import { Controller, Get } from "../../../decorators";
import { Injectable } from "../../../injectable";
import { DataService } from "../../services/data";
import { TestService } from "../services/TestService";

@Injectable()
@Controller()
export class HomeController {
  constructor(
    private testService: TestService,
    private dataService: DataService,
  ) {}

  @Get()
  home() {
    console.log(this.testService);
    console.log(this.dataService);
    return {
      code: 200,
      data: this.testService.add(1, 1),
      msg: "success",
      timestamp: Date.now(),
    };
  }
}
