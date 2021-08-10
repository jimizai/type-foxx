import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class UnprocessableEntityException extends BaseExceptions {
  constructor() {
    super("UnprocessableEntityException", HttpStatus.UNPROCESSABLE_ENTITY, "Unprocessable Entity");
  }
}
