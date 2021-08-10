import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class UnsupportedMediaTypeException extends BaseExceptions {
  constructor() {
    super("UnsupportedMediaTypeException", HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported Media Type");
  }
}
