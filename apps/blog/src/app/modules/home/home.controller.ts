import { Controller, Get } from '@jimizai/decorators';
import { ConfigService } from '@jimizai/config';
import { BaseController } from '@jimizai/curd';
import { Inject } from '@jimizai/injectable';
import { FoxxConfig } from '@/config';

@Controller()
export class HomeController extends BaseController {
  @Inject()
  private configService: ConfigService<FoxxConfig>;

  @Get()
  home() {
    this.setData(this.configService.get('appName')).succeed();
  }

  @Get('/test')
  test() {
    this.setData(this.configService.get('appName')).succeed();
  }
}
