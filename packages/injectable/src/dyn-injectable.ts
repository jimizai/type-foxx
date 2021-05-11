class FoxxDynamicInjectable {}

// deno-lint-ignore no-explicit-any
export function provideDynamicData(key: string, value: any) {
  Reflect.defineMetadata(key, value, FoxxDynamicInjectable);
}

export function getDynamicData(key: string) {
  return Reflect.getMetadata(key, FoxxDynamicInjectable);
}
