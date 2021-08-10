import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class IAmATeapotException extends BaseExceptions {
  constructor() {
    super("IAmATeapotException", HttpStatus.I_AM_A_TEAPOT, "I Am A Teapot");
  }
}
