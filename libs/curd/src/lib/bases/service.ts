import {
  getRepository,
  Repository,
  EntityTarget,
  FindOneOptions,
  InsertResult,
} from 'typeorm';
import { BaseExceptions } from '@jimizai/common';

export abstract class Service<Entity = any> {
  abstract model(): EntityTarget<Entity>;

  private queryBuilderInstance: Repository<Entity>;

  private makeQueryBuilder(): Repository<Entity> {
    this.queryBuilderInstance = getRepository(this.model());
    return this.queryBuilderInstance;
  }

  queryBuilder(): Repository<Entity> {
    return this.queryBuilderInstance || this.makeQueryBuilder();
  }

  async paginate(current: number, pageSize = 20): Promise<[Entity[], number]> {
    const skip = (current - 1) * pageSize;
    return this.queryBuilder().findAndCount({ skip, take: pageSize });
  }

  async store(data: any): Promise<InsertResult> {
    return this.queryBuilder().insert(data);
  }

  async show(id: string, options: FindOneOptions<Entity> = {}) {
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
