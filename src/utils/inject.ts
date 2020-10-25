import { INVALID_DECORATOR_OPERATION, DUPLICATED_INJECTABLE_DECORATOR } from "../exceptions/errMsg";
import { INJECT_TAG, TAGGED_CLS } from "../constants";
import { isArray } from ".";

const camelCase = require("camelcase");

export interface TagPropsMetadata {
	key: string | number | symbol;
	value: any;
}

export interface ReflectResult {
	[key: string]: TagPropsMetadata[];
}

export const tagParameterOrProperty = (
	metadataKey: string,
	annotationTarget: any,
	propertyName: string,
	metadata: TagPropsMetadata,
	parameterIndex?: number
) => {
	let paramsOrPropertiesMetadata: ReflectResult = {};
	const isParameterDecorator = typeof parameterIndex === "number";
	const key =
		parameterIndex !== undefined && isParameterDecorator ? parameterIndex.toString() : propertyName;
	// inject must use in constructor
	if (isParameterDecorator && propertyName !== undefined) {
		throw new Error(INVALID_DECORATOR_OPERATION);
	}

	if (Reflect.hasMetadata(metadataKey, annotationTarget)) {
		paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget);
	}

	let paramOrPropertyMetadata: TagPropsMetadata[] = paramsOrPropertiesMetadata[key];
	if (!isArray(paramOrPropertyMetadata)) {
		paramOrPropertyMetadata = [];
	} else {
		const target = paramOrPropertyMetadata.find((item) => item.key === metadata.key);
		if (target) {
			throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
		}
	}
	paramOrPropertyMetadata.push(metadata);
	paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
	Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
};

export const tagProperty = (target: any, propertyName: string, metadata: TagPropsMetadata) => {
	tagParameterOrProperty(INJECT_TAG, target.constructor, propertyName, metadata);
};

export const tagParameter = (
	target: any,
	parameterIndex: number,
	propertyName: string,
	metadata: TagPropsMetadata
) => {
	tagParameterOrProperty(INJECT_TAG, target, propertyName, metadata, parameterIndex);
};

export const getProviderId = (module) => {
	const meta = Reflect.getMetadata(module, TAGGED_CLS);
	let provideId = "";
	if (meta) {
		provideId = meta.id;
	} else {
		provideId = camelCase(module.name);
	}
	return provideId;
};

export const generateProvideId = (provideId: string, namespace = "") => {
	if (provideId.includes(":")) {
		return provideId;
	}
	return `${namespace}${namespace ? ":" : ""}${provideId}`;
};
