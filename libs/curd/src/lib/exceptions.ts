import { BaseExceptions } from '@jimizai/common';

export class InvalidDecoratorException extends BaseExceptions {
  constructor(message: string) {
    super('InvalidDecoratorItemException', 500, message);
  }
}
