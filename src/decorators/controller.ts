import { normalizePath } from "../utils";
import { PATH_METADATA } from "../constants";

export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(prefix: string = "/"): ClassDecorator {
	return (target) => {
		prefix = normalizePath(prefix);
		Reflect.defineMetadata(PATH_METADATA, prefix, target);
	};
}
