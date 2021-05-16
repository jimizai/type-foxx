import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class ServiceUnavailableException extends BaseExceptions {
  constructor() {
    super("ServiceUnavailableException", HttpStatus.SERVICE_UNAVAILABLE, "Service Unavailable");
  }
}
