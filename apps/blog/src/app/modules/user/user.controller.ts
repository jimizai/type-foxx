import { BaseController } from '@app/bases/controller';
import { Controller, Get } from '@jimizai/decorators';

@Controller('/users')
export class UserController extends BaseController {
  constructor() {
    super();
  }

  @Get()
  index() {
    return this.setData([]).setTotal(10).succeed();
  }
}
