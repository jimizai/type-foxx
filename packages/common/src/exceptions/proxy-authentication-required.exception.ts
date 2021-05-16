import { HttpStatus } from "../status";
import { BaseExceptions } from "./base-exception";

export class ProxyAuthenticationRequiredException extends BaseExceptions {
  constructor() {
    super("ProxyAuthenticationRequiredException", HttpStatus.PROXY_AUTHENTICATION_REQUIRED, "Proxy Authentication Required");
  }
}
