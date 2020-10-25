import { isNumber, isString } from "../utils";
import { INVALID_STATUS_CODE, INVALID_STATUS_CODE_TYPE } from "../exceptions/errMsg";
import getType from "cache-content-type";

export class Response {
	public response;
	private _body: any = null;
	private _explicitStatus: boolean = false;

	constructor(public res: Foxx.Response) {
		this.response = res;
	}

	remove(field: string) {
		this.res.removeHeader(field);
	}

	get header() {
		return this.res.headers;
	}

	get headers() {
		return this.res.headers;
	}

	get(field) {
		return this.header[field.toLowerCase()] || "";
	}

	set(field, val) {
		if (2 === arguments.length) {
			if (Array.isArray(val)) val = val.map((v) => (isString(v) ? v : String(v)));
			else if (isString(val)) val = String(val);
			this.res.setHeader(field, val);
		} else {
			for (const key in field) {
				this.set(key, field[key]);
			}
		}
	}

	get length() {
		if (this.has("Content-Length")) {
			return parseInt(this.get("Content-Length"), 10) || 0;
		}

		const { body } = this;
		if (!body) return undefined;
		if ("string" === typeof body) return Buffer.byteLength(body);
		if (Buffer.isBuffer(body)) return body.length;
		return Buffer.byteLength(JSON.stringify(body));
	}

	set length(n) {
		this.set("Content-Length", n);
	}

	has(field: string) {
		return field.toLowerCase() in this.headers;
	}

	set type(type) {
		type = getType(type);
		if (type) {
			this.set("Content-Type", type);
		} else {
			this.remove("Content-Type");
		}
	}

	get type() {
		const type = this.get("Content-Type");
		if (!type) return "";
		return type.split(";", 1)[0];
	}

	get status() {
		return this.res.statusCode;
	}

	set status(code: number) {
		if (!isNumber(code)) {
			throw new Error(INVALID_STATUS_CODE_TYPE);
		}
		if (code < 100 || code > 999) {
			throw new Error(`${INVALID_STATUS_CODE}: ${code}`);
		}

		this._explicitStatus = true;
		this.res.statusCode = code;
	}

	get body() {
		return this._body;
	}

	set body(val) {
		this._body = val;

		if (val === null) {
			this.status = 204;
			this.remove("Content-Type");
			this.remove("Content-Length");
			this.remove("Transfer-Encoding");
			return;
		}
		if (this._explicitStatus) this.status = 200;
		const setType = !this.has("Content-Type");

		if (isString(val)) {
			if (setType) this.type = /^\s*</.test(val) ? "html" : "text";
			this.length = Buffer.byteLength(val);
			return;
		}

		// buffer
		if (Buffer.isBuffer(val)) {
			if (setType) this.type = "bin";
			this.length = val.length;
			return;
		}

		// json
		this.remove("Content-Length");
		this.type = "json";
	}

	get end() {
		return this.response.end;
	}
}
