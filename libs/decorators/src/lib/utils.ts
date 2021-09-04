import { MethodMetadata, RequestMethod } from './interface';
import { METHOD_METADATA } from './constants';

export function setMethodMetadata(
  target,
  key,
  metadata: Partial<MethodMetadata>
) {
  const metadatas: MethodMetadata = getMethodMetadata(target, key);
  mergeMetadata(metadatas, metadata);
  Reflect.defineMetadata(METHOD_METADATA, metadatas, target, key);
}

export function getMethodMetadata(target, key): MethodMetadata {
  return (
    Reflect.getMetadata(METHOD_METADATA, target, key) || {
      pipes: [],
      guards: [],
      method: RequestMethod.GET,
    }
  );
}

function mergeMetadata(
  metadatas: MethodMetadata,
  partialMetadata: Partial<MethodMetadata>
) {
  if (partialMetadata.method) {
    metadatas.method = partialMetadata.method;
  }
  if (partialMetadata.pipes) {
    metadatas.pipes.push(...partialMetadata.pipes);
  }
  if (partialMetadata.guards) {
    metadatas.guards.push(...partialMetadata.guards);
  }
}
