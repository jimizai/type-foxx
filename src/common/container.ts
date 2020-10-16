import { isClass, toArray } from "../utils";
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
				this.bindClass();
				console.log(exports);
			}
		}
	}

	bindClass(exports, namespace = "", filePath?: string) {
		if (isClass(exports)) {
		}
	}
}
