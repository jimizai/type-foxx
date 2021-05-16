import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class LengthRequiredException extends BaseExceptions {
  constructor() {
    super("LengthRequiredException", HttpStatus.LENGTH_REQUIRED, "Length Required");
  }
}
