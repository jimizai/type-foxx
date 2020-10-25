import { Request } from "./request";
import { Response } from "./response";
import { isString } from "../utils";

export class Context {
	public request: Request;
	public req: Request;
	public response: Response;
	public res: Response;

	constructor(req: Foxx.Request, res: Foxx.Response) {
		this.req = this.request = new Request(req);
		this.res = this.response = new Response(res);
	}

	respond() {
		const { req, res } = this;
		let body = res.body;

		if ("HEAD" === req.method) {
			if (!res.has("Content-Length")) {
				const { length } = res.response;
				if (Number.isInteger(length)) res.length = length;
			}
			return res.end();
		}

		if (null == body) {
			res.status = 404;
			return res.end("Not Found");
		}

		if (Buffer.isBuffer(body)) return res.end(body);
		if (isString(body)) return res.end(body);

		//json
		body = JSON.stringify(body);
		res.length = Buffer.byteLength(body);
		res.end(body);
	}
}
