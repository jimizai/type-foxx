import { Injectable } from '@jimizai/injectable';
import asyncPool from 'tiny-async-pool';

@Injectable()
export class AsyncPool<T, K> {
  private list: T[] = [];
  private fn: (data: T) => Promise<K> | K;

  push(data: T) {
    this.list.push(data);
  }

  merge(arr: T[]) {
    this.list.push(...arr);
  }

  execute(fn: (data: T) => Promise<K> | K) {
    this.fn = fn;
  }

  async run(jobs = 2) {
    return asyncPool(jobs, this.list, this.fn);
  }
}
