import { KoaFoxxDriver } from './driver-koa';
import { FactoryContainer } from '@jimizai/injectable';

describe('driverKoa', () => {
  it('should work', () => {
    const instance: any = FactoryContainer.factory(KoaFoxxDriver);
    console.log(instance);
    expect(instance.port).toBe(7001);
    expect(instance.middlewares.toString()).toBe('');
    expect(instance.routes.toString()).toBe('');
  });
});
