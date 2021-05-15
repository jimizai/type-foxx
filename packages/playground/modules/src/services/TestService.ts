import { Injectable } from "../../../../injectable/lib";

@Injectable()
export class TestService {
  add(x: number, y: number): number {
    return x + y;
  }
}
