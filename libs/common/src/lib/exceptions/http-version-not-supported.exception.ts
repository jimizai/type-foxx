import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class HttpVersionNotSupportedException extends BaseExceptions {
  constructor() {
    super("HttpVersionNotSupportedException", HttpStatus.HTTP_VERSION_NOT_SUPPORTED, "Http Version Not Supported");
  }
}
