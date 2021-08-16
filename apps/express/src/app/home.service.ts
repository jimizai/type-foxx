import { Injectable } from '@jimizai/injectable';

@Injectable()
export class HomeService {
  getData(): string {
    return 'hello wolrd';
  }
}
