import { Injectable, ScopeEnum } from '@jimizai/injectable';
import { OpenApi } from '@jimizai/driver-types';
import { CollectionFactory } from './collection';

@Injectable({
  scope: ScopeEnum.Singleton,
})
export class OpenApiService implements OpenApi {
  constructor(private collectionFactory: CollectionFactory) {}

  get<T>(identity: string): T {
    return this.collectionFactory.get<T>(identity);
  }
}
