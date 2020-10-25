export class Request {
	public request: Foxx.Request;
	constructor(public req: Foxx.Request) {
		this.request = req;
	}

	get method() {
		return this.req.method;
	}
}
