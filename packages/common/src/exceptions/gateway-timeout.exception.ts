import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class GatewayTimeoutException extends BaseExceptions {
  constructor() {
    super("GatewayTimeoutException", HttpStatus.GATEWAY_TIMEOUT, "Gateway Timeout");
  }
}
