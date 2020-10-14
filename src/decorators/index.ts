import createRouter from "@arangodb/foxx/router";
import { normalizePath } from "../utils";

interface Conf {
	method: any;
	path: string;
	target: any;
}

const routerMap: Map<Conf, any[]> = new Map();
const symbolPrefix = Symbol("prefix");

const toArray = (c: any | any[]) => (Array.isArray(c) ? c : [c]);

export class Route {
	private router: Foxx.Router;

	constructor() {
		this.router = createRouter();
	}

	init() {
		require("../routes");
		for (let [conf, controller] of routerMap) {
			const controllers = toArray(controller);
			let prefixPath = conf.target[symbolPrefix];
			if (prefixPath) prefixPath = normalizePath(prefixPath);
			const routerPath = prefixPath + conf.path;
			(this.router as any)[conf.method](routerPath, ...controllers);
		}
		module.context.use(this.router);
	}
}

const router = (conf: { method: any; path: string }): MethodDecorator => (target: any, key) => {
	conf.path = normalizePath(conf.path);
	routerMap.set(
		{
			target,
			...conf
		},
		target[key]
	);
};

// const decorate = (args: any, middleware: Foxx.Middleware) => {
//   let [target, key, descriptor] = args;
//   target[key] = Array.isArray(target[key]);
//   target[key].unshift(middleware);
//   return descriptor;
// };

// const convert = (middleware: Foxx.Middleware) => (...args: Foxx.Middleware[]) =>
//   decorate(args, middleware);

export const controller = (path: string): ClassDecorator => (target: any) => {
	target.prototype[symbolPrefix] = path;
};

export const get = (path: string) =>
	router({
		method: "get",
		path
	});

export const post = (path: string) =>
	router({
		method: "post",
		path
	});
export const put = (path: string) =>
	router({
		method: "put",
		path
	});

export const del = (path: string) =>
	router({
		method: "delete",
		path
	});

export const all = (path: string) =>
	router({
		method: "all",
		path
	});
