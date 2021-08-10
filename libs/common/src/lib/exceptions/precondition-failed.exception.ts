import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class PreconditionFailedException extends BaseExceptions {
  constructor() {
    super("PreconditionFailedException", HttpStatus.PRECONDITION_FAILED, "Precondition Failed");
  }
}
