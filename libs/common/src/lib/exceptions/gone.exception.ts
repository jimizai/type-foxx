import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class GoneException extends BaseExceptions {
  constructor() {
    super("GoneException", HttpStatus.GONE, "Gone");
  }
}
