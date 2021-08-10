import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class UriTooLongException extends BaseExceptions {
  constructor() {
    super("UriTooLongException", HttpStatus.URI_TOO_LONG, "Uri Too Long");
  }
}
