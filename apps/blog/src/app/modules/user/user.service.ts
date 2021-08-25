import { Injectable } from '@jimizai/injectable';
import { UserEntity } from './user.entity';
import { Service } from '@blog/app/bases/service';

@Injectable()
export class UserService extends Service<UserEntity> {
  model() {
    return UserEntity;
  }
}
