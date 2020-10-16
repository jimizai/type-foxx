export interface Type<T> extends Function {
	new (...args: any[]): T;
}

export type Paramtype = "body" | "query" | "param" | "custom";

export interface ArgumentMetadata {
	/**
	 * Indicates whether argument is a body, query, param, or custom parameter
	 */
	readonly type: Paramtype;
	/**
	 * Underlying base type (e.g., `String`) of the parameter, based on the type
	 * definition in the route handler.
	 */
	readonly metatype?: Type<any> | undefined;
	/**
	 * String passed as an argument to the decorator.
	 * Example: `@Body('userId')` would yield `userId`
	 */
	readonly data?: string | undefined;
}

export interface PipeTransform<T = any, R = any> {
	/**
	 * Method to implement a custom pipe.  Called with two parameters
	 *
	 * @param value argument before it is received by route handler method
	 * @param metadata contains metadata about the value
	 */
	transform(value: T, metadata: ArgumentMetadata): R;
}
