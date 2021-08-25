import {
  getRepository,
  Repository,
  EntityTarget,
  FindOneOptions,
} from 'typeorm';
import { BaseExceptions } from '@jimizai/common';

export abstract class Service<Entity> {
  abstract model(): EntityTarget<Entity>;

  private queryBuilderInstance: Repository<Entity>;

  private makeQueryBuilder(): Repository<Entity> {
    this.queryBuilderInstance = getRepository(this.model());
    return this.queryBuilderInstance;
  }

  queryBuilder(): Repository<Entity> {
    return this.queryBuilderInstance || this.makeQueryBuilder();
  }

  async store(data: any): Promise<Entity | Entity[]> {
    return this.queryBuilder().create(data);
  }

  async show(id: string, options: FindOneOptions<Entity>) {
    return this.queryBuilder().findOne(id, options);
  }

  async delete(id: string | string[], isForce = false) {
    return isForce
      ? this.queryBuilder().delete(id)
      : this.queryBuilder().softDelete(id);
  }

  async update(id: string, data: any) {
    return this.queryBuilder().update(id, data);
  }

  abort(code: number, message = 'error') {
    throw new BaseExceptions('AppError', code, message);
  }
}
