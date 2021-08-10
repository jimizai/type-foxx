import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class RequestedRangeNotSatisfiableException extends BaseExceptions {
  constructor() {
    super("RequestedRangeNotSatisfiableException", HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE, "Requested Range Not Satisfiable");
  }
}
