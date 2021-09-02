import { Controller, Get, UseGuards } from '@jimizai/decorators';
import { ConfigService } from '@jimizai/config';
import { BaseController } from '@jimizai/curd';
import { Inject } from '@jimizai/injectable';
import { AuthGuard } from '@app/guards/auth.guard';
import { FoxxConfig } from '@/config';

@Controller()
export class HomeController extends BaseController {
  @Inject()
  private configService: ConfigService<FoxxConfig>;

  @Get()
  @UseGuards(AuthGuard)
  home() {
    this.setData(this.configService.get('appName')).succeed();
  }

  @Get('/test')
  test() {
    this.setData(this.configService.get('appName')).succeed();
  }
}
