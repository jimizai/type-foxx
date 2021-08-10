import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class NotFoundException extends BaseExceptions {
  constructor() {
    super("NotFoundException", HttpStatus.NOT_FOUND, "Not Found");
  }
}
