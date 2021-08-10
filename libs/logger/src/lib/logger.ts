import { Injectable, Inject } from '@jimizai/injectable';
import {
  INJECT_LOGGER_DEBUG_GRADE,
  INJECT_LOGGER_NAME,
  DebugGradeEnum,
} from './constants';

@Injectable()
export class Logger {
  private prefix: string[] = [];

  constructor(
    @Inject(INJECT_LOGGER_NAME) prefix: string,
    @Inject(INJECT_LOGGER_DEBUG_GRADE) private grade: DebugGradeEnum
  ) {
    this.prefix.push(prefix);
  }

  createConsoleFunc(grade: DebugGradeEnum) {
    return (...args) => {
      if (this.grade >= grade) {
        const logFunc = this.fromDebugGradeEnum(grade);
        return console[logFunc](...this.prefix, ...args);
      }
    };
  }

  fromDebugGradeEnum(e: DebugGradeEnum): string {
    if (DebugGradeEnum.Debug === e) {
      return 'log';
    } else if (DebugGradeEnum.Error === e) {
      return 'error';
    } else if (DebugGradeEnum.Warn === e) {
      return 'warn';
    } else {
      return 'log';
    }
  }

  setPrefix(prefix) {
    if (prefix) {
      this.prefix.push(prefix);
    }
  }

  get debug() {
    return this.createConsoleFunc(DebugGradeEnum.Debug);
  }

  get warn() {
    return this.createConsoleFunc(DebugGradeEnum.Warn);
  }

  get error() {
    return this.createConsoleFunc(DebugGradeEnum.Error);
  }
}
