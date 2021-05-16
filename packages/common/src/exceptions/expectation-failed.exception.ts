import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class ExpectationFailedException extends BaseExceptions {
  constructor() {
    super("ExpectationFailedException", HttpStatus.EXPECTATION_FAILED, "Expectation Failed");
  }
}
