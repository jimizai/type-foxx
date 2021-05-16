import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class FailedDependencyException extends BaseExceptions {
  constructor() {
    super("FailedDependencyException", HttpStatus.FAILED_DEPENDENCY, "Failed Dependency");
  }
}
