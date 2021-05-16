import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class BadRequestException extends BaseExceptions {
  constructor() {
    super("BadRequestException", HttpStatus.BAD_REQUEST, "Bad Request");
  }
}
