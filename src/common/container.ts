import { isClass, toArray, isFunction, getProviderId, generateProvideId } from "../utils";
import { run } from "@midwayjs/glob";

const DEFAULT_PATTERN = ["**/**.ts", "**/**.tsx", "**/**.js"];
const DEFAULT_IGNORE_PATTERN = [
	"**/**.d.ts",
	"**/logs/**",
	"**/run/**",
	"**/public/**",
	"**/view/**",
	"**/views/**",
	"**/app/extend/**"
];

interface LoadOptions {
	loadDir: string | string[];
	pattern?: string | string[];
	ignore?: string | string[];
	namespace?: string;
}

interface ObjectDefinitionOptions {
	namespace?: string;
	srcPath?: string;
}

export class Container {
	init(): void {
		this.loadDirectory({ loadDir: "**/modules/**" });
	}

	loadDirectory(opts: LoadOptions) {
		const loadDirs = toArray(opts.loadDir);
		for (const dir of loadDirs) {
			const fileResults = run(DEFAULT_PATTERN.concat(opts.pattern || []), {
				cwd: dir,
				ignore: DEFAULT_IGNORE_PATTERN.concat(opts.ignore || [])
			});
			for (const file of fileResults) {
				console.log(`\nmain: ************ binding "${file}" **********`);
				console.log(` namespace => "${opts.namespace}"`);
				const exports = require(file);
				this.bindClass(exports, opts.namespace, file);
			}
		}
	}

	bindClass(exports, namespace = "", filePath?: string) {
		if (isClass(exports)) {
			this.bindModule(exports, namespace, filePath);
		} else {
			exports.forEach((module) => {
				if (isClass(module) || isFunction(module)) {
					this.bindModule(module, namespace, filePath);
				}
			});
		}
	}

	protected bindModule(module, namespace = "", filePath?: string) {
		const provideId = getProviderId(module);
		this.bind(generateProvideId(provideId, namespace), module, { namespace, srcPath: filePath });
	}

	protected bind(identifier: string, target: any, options: ObjectDefinitionOptions): void {}
}
