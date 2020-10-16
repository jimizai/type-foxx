import { ROUTE_ARGS_METADATA } from "../constants";
import { RouteParamtypes } from "../enums";
import { isNil, isString } from "../utils";
import { Type, PipeTransform } from "../interfaces";

export type ParamData = object | string | number;
export interface RouteParamsMetadata {
	index: number;
	data?: ParamData;
}

export function assignMetadata<TParamtype = any, TArgs = any>(
	args: TArgs,
	paramtype: TParamtype,
	index: number,
	data?: ParamData,
	...pipes: any[]
) {
	return {
		...args,
		[`${paramtype}:${index}`]: {
			index,
			data,
			pipes
		}
	};
}

function createRouteParamDecorator(paramtype: RouteParamtypes) {
	return (data?: ParamData): ParameterDecorator => (target, key, index) => {
		const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key);
		Reflect.defineMetadata(
			ROUTE_ARGS_METADATA,
			assignMetadata<RouteParamtypes, Record<number, RouteParamsMetadata>>(
				args,
				paramtype,
				index,
				data
			),
			target.constructor,
			key
		);
	};
}

const createPipesRouteParamDecorator = (paramtype: RouteParamtypes) => (
	data?: any,
	...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator => (target, key, index) => {
	const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
	const hasParamData = isNil(data) || isString(data);
	const paramData = hasParamData ? data : undefined;
	const paramPipes = hasParamData ? pipes : [data, ...pipes];

	Reflect.defineMetadata(
		ROUTE_ARGS_METADATA,
		assignMetadata(args, paramtype, index, paramData, ...paramPipes),
		target.constructor,
		key
	);
};

export const Request: () => ParameterDecorator = createRouteParamDecorator(RouteParamtypes.REQUEST);

export const Response: () => ParameterDecorator = createRouteParamDecorator(
	RouteParamtypes.RESPONSE
);

export const Next: () => ParameterDecorator = createRouteParamDecorator(RouteParamtypes.NEXT);

export const Ip: () => ParameterDecorator = createRouteParamDecorator(RouteParamtypes.IP);

export const Headers: (property?: string) => ParameterDecorator = createRouteParamDecorator(
	RouteParamtypes.HEADERS
);

export function Query(): ParameterDecorator;
export function Query(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Query(
	property: string,
	...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export function Query(
	property?: string | (Type<PipeTransform> | PipeTransform),
	...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
	return createPipesRouteParamDecorator(RouteParamtypes.QUERY)(property, ...pipes);
}

export function Body(): ParameterDecorator;
export function Body(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Body(
	property: string,
	...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export function Body(
	property?: string | (Type<PipeTransform> | PipeTransform),
	...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
	return createPipesRouteParamDecorator(RouteParamtypes.BODY)(property, ...pipes);
}

export function Param(): ParameterDecorator;
export function Param(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Param(
	property: string,
	...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export function Param(
	property?: string | (Type<PipeTransform> | PipeTransform),
	...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
	return createPipesRouteParamDecorator(RouteParamtypes.PARAM)(property, ...pipes);
}
