import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class RequestTimeoutException extends BaseExceptions {
  constructor() {
    super("RequestTimeoutException", HttpStatus.REQUEST_TIMEOUT, "Request Timeout");
  }
}
