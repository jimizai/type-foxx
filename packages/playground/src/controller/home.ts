import { Controller, Get } from "../../../decorators";
import { Injectable } from "../../../injectable";
import { DataService } from "../../services/data";

@Injectable()
@Controller()
export class HomeController {
  constructor(
    private dataService: DataService,
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
}
