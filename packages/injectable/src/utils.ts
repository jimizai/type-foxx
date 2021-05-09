// deno-lint-ignore no-explicit-any
export const getConstructorParams = (target: any): string[] => {
  if (!target) return [];
  const argsStr = target
    .toString()
    .split(/constructor\s*[^\(]*\(\s*([^\)]*)\)/m)[1];
  return argsStr?.split(",").filter(Boolean).map((arg) => arg.trim()) || [];
};

// deno-lint-ignore no-explicit-any
export const getIdentByTarget = (target: any): string => {
  const name = target.name;
  return name.charAt(0).toLowerCase() + name.slice(1, name.length);
};

export const getTargetNameByIdent = (ident: string): string => {
  return ident.charAt(0).toUpperCase() + ident.slice(1, ident.length);
};
