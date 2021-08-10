import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class NotAcceptableException extends BaseExceptions {
  constructor() {
    super("NotAcceptableException", HttpStatus.NOT_ACCEPTABLE, "Not Acceptable");
  }
}
