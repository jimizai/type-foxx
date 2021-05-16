import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class ConflictException extends BaseExceptions {
  constructor() {
    super("ConflictException", HttpStatus.CONFLICT, "Conflict");
  }
}
