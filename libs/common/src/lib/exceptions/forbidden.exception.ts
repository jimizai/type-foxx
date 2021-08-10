import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class ForbiddenException extends BaseExceptions {
  constructor() {
    super("ForbiddenException", HttpStatus.FORBIDDEN, "Forbidden");
  }
}
