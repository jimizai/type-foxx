import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class BadGatewayException extends BaseExceptions {
  constructor() {
    super("BadGatewayException", HttpStatus.BAD_GATEWAY, "Bad Gateway");
  }
}
