import { ScopeEnum } from './enum';
import type { FactoryContainer } from './container';

export type Typed<T = any> = { new (...args: any[]): T };

export interface Context<T = any> {
  target: Typed<T>;
  instance: T | null;
  modules: Record<string, Typed>;
  containers: Record<string, any>;
  factory: <C>(c: Typed<C>) => C;
  metadata?: {
    scope?: ScopeEnum;
  };
  FactoryContainer: typeof FactoryContainer;
}

export type NextFunction = () => void;

export interface FoxxMiddleware {
  call(ctx: Context, next: NextFunction): void;
}
