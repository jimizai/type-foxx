export class ConfigServiceException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigServiceException";
  }
}
