import { KoaFoxxDriver } from './driver-koa';
import { Container } from '@jimizai/injectable';

describe('driverKoa', () => {
  it('should work', () => {
    const instance: any = Container.factory(KoaFoxxDriver);
    console.log(instance);
    expect(instance.port).toBe(7001);
    expect(instance.middlewares.toString()).toBe('');
    expect(instance.routes.toString()).toBe('');
  });
});
