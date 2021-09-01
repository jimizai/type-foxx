import { ConnectionOptions } from 'typeorm';
import { JwtOpitons } from '@jimizai/jwt';
import { BlogEntity } from '@app/modules/blog/blog.entity';

const orm: ConnectionOptions = {
  type: 'mysql',
  host: 'test',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'blog',
  logging: true,
  entities: [BlogEntity],
};
const jwt: JwtOpitons = {
  secret: 'testsecret',
};

export default {
  appName: 'blog',
  orm,
  jwt,
};
