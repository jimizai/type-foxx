export const normalizePath = (path: string): string =>
  path.startsWith("/") ? path : `/${path}`;
