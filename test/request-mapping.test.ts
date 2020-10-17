import { Controller, Get, Post, Delete, Put, All, Options, Patch } from "../src";
import { PATH_METADATA, METHOD_METADATA } from "../src/constants";
import { RequestMethod } from "../src/enums";

describe("Request mappings", () => {
	@Controller("test")
	class Test {
		@Get()
		index() {}

		@Post()
		store() {}

		@Put()
		update() {}

		@Delete()
		del() {}

		@All()
		all() {}

		@Options()
		options() {}

		@Patch()
		patch() {}
	}

	it("test controller", () => {
		const path = Reflect.getMetadata(PATH_METADATA, Test);
		expect(path).toBe("/test");
	});

	it("test request mappings methods", () => {
		const get = Reflect.getMetadata(METHOD_METADATA, Test.prototype["index"]);
		expect(get).toBe(RequestMethod.GET);

		const post = Reflect.getMetadata(METHOD_METADATA, Test.prototype["store"]);
		expect(post).toBe(RequestMethod.POST);

		const put = Reflect.getMetadata(METHOD_METADATA, Test.prototype["update"]);
		expect(put).toBe(RequestMethod.PUT);

		const del = Reflect.getMetadata(METHOD_METADATA, Test.prototype["del"]);
		expect(del).toBe(RequestMethod.DELETE);

		const all = Reflect.getMetadata(METHOD_METADATA, Test.prototype["all"]);
		expect(all).toBe(RequestMethod.ALL);

		const options = Reflect.getMetadata(METHOD_METADATA, Test.prototype["options"]);
		expect(options).toBe(RequestMethod.OPTIONS);

		const patch = Reflect.getMetadata(METHOD_METADATA, Test.prototype["patch"]);
		expect(patch).toBe(RequestMethod.PATCH);
	});

	it("test request mappings urls", () => {
		const get = Reflect.getMetadata(PATH_METADATA, Test.prototype["index"]);
		expect(get).toBe("/");

		const post = Reflect.getMetadata(PATH_METADATA, Test.prototype["store"]);
		expect(post).toBe("/");

		const put = Reflect.getMetadata(PATH_METADATA, Test.prototype["update"]);
		expect(put).toBe("/");

		const del = Reflect.getMetadata(PATH_METADATA, Test.prototype["del"]);
		expect(del).toBe("/");

		const all = Reflect.getMetadata(PATH_METADATA, Test.prototype["all"]);
		expect(all).toBe("/");

		const options = Reflect.getMetadata(PATH_METADATA, Test.prototype["options"]);
		expect(options).toBe("/");

		const patch = Reflect.getMetadata(PATH_METADATA, Test.prototype["patch"]);
		expect(patch).toBe("/");
	});
});
