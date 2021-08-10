import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class MethodNotAllowedException extends BaseExceptions {
  constructor() {
    super("MethodNotAllowedException", HttpStatus.METHOD_NOT_ALLOWED, "Method Not Allowed");
  }
}
