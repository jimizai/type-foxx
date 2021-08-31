import { BaseModel } from '@app/bases/model';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'blogs' })
export class BlogEntity extends BaseModel {
  @Column()
  title: string;

  @Column()
  content: string;
}
