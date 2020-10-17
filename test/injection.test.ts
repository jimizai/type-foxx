import { Inject, Provide } from "../src";
import { INJECT_TAG, TAGGED_CLS } from "../src/constants";

describe("test injectable decorators", () => {
	@Provide()
	class A {}

	@Provide()
	class C {}

	@Provide()
	class B {
		constructor(@Inject() c: C) {}

		@Inject()
		//@ts-ignore
		a: A;
	}

	it("provide decorator", () => {
		const provideA = Reflect.getMetadata(TAGGED_CLS, A);
		expect(provideA.id).toBe("a");
		expect(provideA.originName).toBe("A");
	});

	it("inject decorator", () => {
		const result = Reflect.getMetadata(INJECT_TAG, B);
		const provideC = result["0"][0];
		const provideA = result["a"][0];
		expect(provideC.key).toBe("inject");
		expect(provideC.value).toBe("c");
		expect(provideA.key).toBe("inject");
		expect(provideA.value).toBe("a");
	});
});
