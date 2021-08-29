import 'reflect-metadata';
import { Inject, Injectable } from './decorators';
import { FactoryContainer } from './container';

const INEJCT_ARG = 'INEJCT_ARG';
const DEFAULT_ARG = 'hello wolrd';
const INEJCT_ARG2 = 'INEJCT_ARG2';

@Injectable()
class A {
  constructor(@Inject(INEJCT_ARG) public str: string = 'hello wolrd') {}
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
    const c = FactoryContainer.factory(C);
    const e = FactoryContainer.factory(E);
    expect(e.d).toBe(c.d);
  });

  it('should inject default value work', () => {
    const a = FactoryContainer.factory(A);
    expect(a.str).toBe('hello wolrd');

    FactoryContainer.bind(INEJCT_ARG2, DEFAULT_ARG);
    const b = FactoryContainer.factory(B);
    expect(b.str).toBe('hello wolrd');
  });
});
