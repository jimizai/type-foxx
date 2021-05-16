import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class TooManyRequestsException extends BaseExceptions {
  constructor() {
    super("TooManyRequestsException", HttpStatus.TOO_MANY_REQUESTS, "Too Many Requests");
  }
}
