interface ReturnData {
	_id: string;
	data: object;
	ttl: number;
	created_at: Date;
	updated_at: Date;
	_attachments: [];
}
declare class Liteq {
	private;
	helpers: {
		encrypt: (text?: string) => string
		decrypt: (text?: string) => (Buffer<ArrayBufferLike> & string) | undefined
		genUuid: (n?: number) => string
	};
	constructor(opts?: {
		dbname: string
	});
	get path();
	get name();
	info();
	/**
	* @info -listen to db changes
	* @param cb - callback function
	*/
	onChange(cb?);
	/**
	* @param id -get item by its id.
	* @param cb - callback function to listen to.
	* @example await get("one")
	*/
	get(id: string, cb: (ev: ReturnData | null) => {}): Promise<ReturnData | null>;
	/**
	* @param id - document id to set,default autogen.
	* @param data  -document to save.
	* @param ttl -time to expire in number,defaults to 0 no expiry.
	*/
	set(id?, data?: {}, ttl?: number);
	remove(id?: string);
	onRemoved(cb?);
	clear();
	getKeys();
	onCleared(cb?);
	getSize();
	attachments: {
		image: {}
		file: {}
	};
}
export { Liteq as default, Liteq };
