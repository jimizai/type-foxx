import { driverKoa } from './driver-koa';

describe('driverKoa', () => {
  it('should work', () => {
    expect(driverKoa()).toEqual('driver-koa');
  });
});
