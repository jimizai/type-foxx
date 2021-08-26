import { Controller, Get } from '@jimizai/decorators';
import { ConfigService } from '@app/shared/config.service';
import { BaseController } from '@app/bases/controller';

@Controller()
export class HomeController extends BaseController {
  constructor(private configService: ConfigService) {
    super();
  }

  @Get()
  home() {
    return this.setData(this.configService.get('appName')).succeed();
  }
}
