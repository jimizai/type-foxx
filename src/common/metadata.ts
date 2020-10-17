export class Metadata {
	public key: string | number | symbol;
	public value: any;

	constructor(key: string | number | symbol, value: any) {
		this.key = key;
		this.value = value;
	}

	toString() {
		return `tagged: { key:${this.key.toString()}, value: ${this.value} }`;
	}
}
