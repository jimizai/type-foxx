import { CATCH_METADATA } from "@jimizai/decorators";
import { FactoryContainer } from "@jimizai/injectable";

export class ExceptionHandlerContainer extends FactoryContainer {
  //deno-lint-ignore no-explicit-any
  protected exceptionHandlers: Record<string, any[]> = {};

  constructor(
    //deno-lint-ignore no-explicit-any
    targets: any[],
    //deno-lint-ignore no-explicit-any
    providers: { provide: string; useValues: any }[] = [],
  ) {
    super(targets, providers);
    this.initExceptionHandlers();
  }

  private initExceptionHandlers() {
    Object.keys(this.modules).forEach((key) => {
      const module = this.modules[key];
      const args = Reflect.getMetadata(CATCH_METADATA, module.target);
      if (args) {
        this.exceptionHandlers[key] = args;
      }
    });
  }

  // deno-lint-ignore no-explicit-any
  public getHandlers(): { instance: any; handlers: any[] }[] {
    return Object.keys(this.exceptionHandlers).reduce((prev, key) => [
      ...prev,
      {
        instance: this.modules[key].instance,
        handlers: this.exceptionHandlers[key],
      },
    ], []);
  }
}
