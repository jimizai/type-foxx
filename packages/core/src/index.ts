interface Route {
  method: string;
  url: string;
  args: string[];
}

export class FoxxCoreContainer {
  private routes: Route[];
}
