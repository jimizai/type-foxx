import { getTargetNameByIdent } from "./utils";

export class ModuleContainer {
  /**
   * key is target name value is target
   *
   * @static
   * @type {Record<string, any>}
   * @memberof ModuleContainer
   */
  static modules: Record<string, any> = {};

  static add(target: any) {
    this.modules[target.name] = target;
  }

  static remove(target: any) {
    delete this.modules[target.name];
  }

  static get(ident: string) {
    return this.getTargetByIdent(ident);
  }

  static getTargetByIdent(ident: string) {
    return this.modules[getTargetNameByIdent(ident)];
  }
}
