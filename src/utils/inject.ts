import { INVALID_DECORATOR_OPERATION, DUPLICATED_INJECTABLE_DECORATOR } from "../exceptions/errMsg";
import { INJECT_TAG } from "../constants";
import { isArray } from ".";

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
		parameterIndex !== undefined && isParameterDecorator ? parameterIndex.toStrin() : propertyName;
	// inject must use in constructor
	if (isParameterDecorator && propertyName !== undefined) {
		throw new Error(INVALID_DECORATOR_OPERATION);
	}

	if (Reflect.hasMetadata(metadataKey, annotationTarget)) {
		paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget);
	}

	let paramOrPropertyMetadata: TagPropsMetadata[] = paramsOrPropertiesMetadata[key];
	if (!isArray(paramsOrPropertiesMetadata)) {
		paramOrPropertyMetadata = [];
	} else {
		const target = paramOrPropertyMetadata.find((item) => item.key === metadata.key);
		if (target) {
			throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
		}
		paramOrPropertyMetadata.push(metadata);
		paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
		Reflect.defineMetadata(metadataKey, target, paramsOrPropertiesMetadata);
	}
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
