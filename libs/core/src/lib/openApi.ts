import { Injectable, ScopeEnum, Inject } from '@jimizai/injectable';
import { CollectionFactory } from './collection';
import { OpenApi } from '@jimizai/driver-types';

@Injectable({
  scope: ScopeEnum.Singleton,
})
export class OpenApiService implements OpenApi {
  @Inject()
  collectionFactory: CollectionFactory;

  get<T>(target: { new (...args: any[]): T }): T | undefined {
    return this.collectionFactory.get(target);
  }
}
