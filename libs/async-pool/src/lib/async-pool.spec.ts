import { AsyncPool } from './async-pool';
import { FactoryContainer } from '@jimizai/injectable';
import { sleep } from '@jimizai/utils';

describe('asyncPool', () => {
  it('should work', async () => {
    const asyncPool =
      FactoryContainer.factory<AsyncPool<string, string>>(AsyncPool);
    const list = ['test', 'test2', 'test3', 'test4'];
    asyncPool.merge(list);
    asyncPool.execute((str: string) => {
      expect(list.includes(str)).toBe(true);
      return str;
    });
    await asyncPool.run();
    asyncPool.merge(list);
    await sleep(100);
    expect(asyncPool.getResults().length).toBe(8);
  });
});
