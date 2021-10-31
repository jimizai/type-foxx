import { AsyncPool } from './async-pool';
import { FactoryContainer } from '@jimizai/injectable';

describe('asyncPool', () => {
  it('should work', async () => {
    const asyncPool =
      FactoryContainer.factory<AsyncPool<string, void>>(AsyncPool);
    const list = ['test', 'test2', 'test3', 'test4'];
    asyncPool.merge(list);
    asyncPool.execute((str: string) => {
      expect(list.includes(str)).toBe(true);
    });
    await asyncPool.run();
  });
});
