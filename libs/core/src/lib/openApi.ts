import { Injectable } from '@jimizai/injectable';
import { OpenApi } from '@jimizai/driver-types';
import { CollectionFactory } from './collection';

@Injectable()
export class OpenApiService implements OpenApi {
  constructor(private collectionFactory: CollectionFactory) {}

  get<T>(identity: string): T {
    return this.collectionFactory.get<T>(identity);
  }
}
