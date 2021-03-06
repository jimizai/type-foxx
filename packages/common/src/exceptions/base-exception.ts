export class BaseExceptions extends Error {
  status: number;
  constructor(name: string, code: number, message: string) {
    super(message);
    this.name = name;
    this.status = code;
  }

  getStatus(): number {
    return this.status;
  }

  getMessage(): string {
    return this.message;
  }
}
