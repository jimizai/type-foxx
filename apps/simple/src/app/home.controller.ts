import { Controller, Get } from '@jimizai/decorators';

@Controller()
export class HomeContoller {
  @Get()
  async home() {
    return {
      code: 200,
      data: 'success',
    };
  }

  @Get('/test')
  test() {
    return 'this is test';
  }
}
