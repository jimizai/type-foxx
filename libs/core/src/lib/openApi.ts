import { Injectable, ScopeEnum, FactoryContainer } from '@jimizai/injectable';
import { OpenApi } from '@jimizai/driver-types';

@Injectable({
  scope: ScopeEnum.Singleton,
})
export class OpenApiService implements OpenApi {
  get<T>(target: { new (...args: any[]): T }): T | undefined {
    return FactoryContainer.factory(target);
  }
}
