import { Controller, Get } from '@jimizai/decorators';
import { ConfigService } from '@app/shared/config.service';
import { BaseController } from '@jimizai/curd';
import { Inject } from '@jimizai/injectable';

@Controller()
export class HomeController extends BaseController {
  @Inject()
  private configService: ConfigService;

  @Get()
  home() {
    this.setData(this.configService.get('appName')).succeed();
  }
}
