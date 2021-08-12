import { Controller, Get } from '@jimizai/decorators';
import { HomeService } from './home.service';

@Controller()
export class HomeContoller {
  constructor(private homeService: HomeService) {}

  @Get()
  async home() {
    return {
      code: 200,
      data: this.homeService.getData(),
    };
  }

  @Get('/test')
  test() {
    return 'this is test';
  }
}
