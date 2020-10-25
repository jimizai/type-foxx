import { Metadata } from "../common/metadata";
import { INJECT_TAG, TAGGED_CLS } from "../constants";
import { DUPLICATED_INJECTABLE_DECORATOR } from "../exceptions/errMsg";
import { getParamNames, tagParameter, tagProperty, getProviderId } from "../utils";

export function Provide(identifier?: string): ClassDecorator {
	return (target) => {
		if (Reflect.hasMetadata(TAGGED_CLS, target)) {
			throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
		}

		Reflect.defineMetadata(
			TAGGED_CLS,
			{
				id: identifier || getProviderId(target),
				originName: target.name
			},
			target
		);

		// init property
	};
}

export function Inject(identifier?: string): PropertyDecorator & ParameterDecorator {
	return (target, key, index?: number) => {
		// parameterDecorator
		if (typeof index === "number") {
			if (!identifier) {
				const args = getParamNames(target);
				if (target.length === args.length && index < target.length) {
					identifier = args[index];
				}
			}
			const metadata = new Metadata(INJECT_TAG, identifier);
			tagParameter(target, index, key, metadata);
		} else {
			// propertyDecorator
			if (!identifier) {
				identifier = key;
			}
			const metadata = new Metadata(INJECT_TAG, identifier);
			tagProperty(target, identifier!, metadata);
		}
	};
}
