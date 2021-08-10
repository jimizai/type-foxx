import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class NotImplementedException extends BaseExceptions {
  constructor() {
    super("NotImplementedException", HttpStatus.NOT_IMPLEMENTED, "Not Implemented");
  }
}
