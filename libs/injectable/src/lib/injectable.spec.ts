import 'reflect-metadata';
import { Inject, Injectable } from './decorators';
import { Container } from './container';
import { ROOT_TARGET_INJECTABLE } from './constants';

const INEJCT_ARG = 'INEJCT_ARG';
const DEFAULT_ARG = 'hello wolrd';
const INEJCT_ARG2 = 'INEJCT_ARG2';

@Injectable()
class A {
  constructor(@Inject(INEJCT_ARG, 'hello wolrd') public str: string) {}
}

@Injectable()
class B {
  constructor(@Inject(INEJCT_ARG2) public str: string) {
    //
  }
}

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
  it('should auto injectable work', () => {
    const c = Container.factory(C);
    const root_c = Reflect.getMetadata(ROOT_TARGET_INJECTABLE, C);
    expect(root_c).toBe(c);
    const e = Container.factory(E);
    expect(e.d).toBe(c.d);
  });

  it('should inject default value work', () => {
    const a = Container.factory(A);
    expect(a.str).toBe('hello wolrd');

    Container.bind(INEJCT_ARG2, DEFAULT_ARG);
    const b = Container.factory(B);
    expect(b.str).toBe('hello wolrd');
  });
});
