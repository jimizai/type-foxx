import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class PayloadTooLargeException extends BaseExceptions {
  constructor() {
    super("PayloadTooLargeException", HttpStatus.PAYLOAD_TOO_LARGE, "Payload Too Large");
  }
}
