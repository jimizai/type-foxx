import 'reflect-metadata';
import { Injectable } from './decorators';
import { Container } from './container';
import { ROOT_TARGET_INJECTABLE } from './constants';

@Injectable({ providedIn: 'root' })
class D {}
@Injectable({ providedIn: 'root' })
class C {
  constructor(public d: D) {
    //
  }
}

@Injectable()
class E {
  constructor(public d: D) {
    //
  }
}

describe('injectable', () => {
  it('should work', () => {
    const c = Container.factory(C);
    const root_c = Reflect.getMetadata(ROOT_TARGET_INJECTABLE, C);
    expect(root_c).toBe(c);
    const e = Container.factory(E);
    expect(e.d).toBe(c.d);
  });
});
