import { BaseController } from '@app/bases/controller';
import { CURD } from '@app/shared/curd';
import { Controller, Delete, Get, Post, Put } from '@jimizai/decorators';
import { Inject } from '@jimizai/injectable';
import { SERVICE_PROVIDER, BlogService } from './blog.service';

@Controller('/blogs')
export class BlogController extends BaseController {
  @Inject(SERVICE_PROVIDER)
  service: BlogService;

  @Get()
  @CURD.paginate()
  index() {
    //
  }

  @Get('/:id')
  @CURD.show
  show() {
    //
  }

  @Post()
  @CURD.store
  store() {
    //
  }

  @Put()
  @CURD.update
  update() {
    //
  }

  @Delete()
  @CURD.destroy
  delete() {
    //
  }
}
