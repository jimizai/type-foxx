import { jwt } from './jwt';

describe('jwt', () => {
  it('should work', () => {
    expect(jwt()).toEqual('jwt');
  });
});
