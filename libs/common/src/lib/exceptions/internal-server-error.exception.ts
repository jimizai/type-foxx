import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class InternalServerErrorException extends BaseExceptions {
  constructor() {
    super(
      "InternalServerErrorException",
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
    );
  }
}
