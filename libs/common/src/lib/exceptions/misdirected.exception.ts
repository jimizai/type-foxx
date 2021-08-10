import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class MisdirectedException extends BaseExceptions {
  constructor() {
    super("MisdirectedException", HttpStatus.MISDIRECTED, "Misdirected");
  }
}
