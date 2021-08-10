import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class UnauthorizedException extends BaseExceptions {
  constructor() {
    super("UnauthorizedException", HttpStatus.UNAUTHORIZED, "Unauthorized");
  }
}
