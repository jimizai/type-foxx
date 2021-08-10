export const INJECT_LOGGER_NAME = 'INJECT_LOGGER_NAME';
export const INJECT_LOGGER_DEBUG_GRADE = 'INJECT_LOGGER_DEBUG_GRADE';

export enum DebugGradeEnum {
  Error = 1 << 0,
  Warn = 1 << 2,
  Debug = 1 << 4,
}
