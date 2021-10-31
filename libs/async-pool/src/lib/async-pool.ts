import { Injectable } from '@jimizai/injectable';
import { Init } from '@jimizai/decorators';
import asyncPool from 'tiny-async-pool';

const WAKEUP_METHODS = ['push'];

@Injectable()
export class AsyncPool<T, K> {
  private list: T[] = [];
  private fn: (data: T) => Promise<K> | K;
  private running = false;
  private results: K[] = [];
  private jobs = 2;

  @Init()
  protected AsyncPool() {
    const arrExtend = Object.create(Array.prototype);
    // eslint-disable-next-line
    const self = this;
    WAKEUP_METHODS.forEach((method) => {
      const oldMethod = Array.prototype[method];
      arrExtend[method] = function (...args) {
        oldMethod.apply(this, args);
        self.wake();
      };
    });

    (this.list as any).__proto__ = arrExtend;
  }

  getResults() {
    return this.results;
  }

  push(data: T) {
    this.list.push(data);
  }

  merge(arr: T[]) {
    this.list.push(...arr);
  }

  private wake() {
    if (this.running) {
      return;
    }
    this.run();
  }

  execute(fn: (data: T) => Promise<K> | K) {
    this.fn = fn;
    this.wake();
  }

  async run(jobs?: number) {
    if (!this.fn || this.running) return;
    if (jobs) {
      this.jobs = jobs;
    }
    this.running = true;
    const res = await asyncPool(this.jobs, this.list, this.fn);
    this.results.push(...res);
    this.running = false;
  }
}
