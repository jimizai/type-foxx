import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class PaymentRequiredException extends BaseExceptions {
  constructor() {
    super("PaymentRequiredException", HttpStatus.PAYMENT_REQUIRED, "Payment Required");
  }
}
