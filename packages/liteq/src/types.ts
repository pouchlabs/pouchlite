
export interface ReturnData{
    _id: string, 
	data: object,
	ttl: number,
	created_at: Date,
	updated_at: Date,
    _attachments:[]
}
export interface Config{
	docs: object[],
	count:number
}