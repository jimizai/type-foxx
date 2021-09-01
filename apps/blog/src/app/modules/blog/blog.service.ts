import { Service } from '@jimizai/curd';
import { BlogEntity } from './blog.entity';
import { Injectable } from '@jimizai/injectable';

export const SERVICE_PROVIDER = 'BlogService';

@Injectable()
export class BlogService extends Service<BlogEntity> {
  model() {
    return BlogEntity;
  }
}
