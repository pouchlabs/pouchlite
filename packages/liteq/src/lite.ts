
import { existsSync,mkdirSync,stat} from "node:fs";
import { join } from "node:path";
import deepmerge from "deepmerge";
import Event from "@pouchlab/emitter";
import { nanoid } from "nanoid";
import { loopMerged,createFile,loadConfig,writeConfig,getDocumentById,putDocumentById,bytesForHuman,removeDocument,removeAttachment, checktype } from "./utils.ts";
import {encrypt,decrypt,} from "./service-enc.ts"
import { getImage,putImage,removeImage,putFileAttachment } from "./storage.ts";
 
//types
import type { ReturnData,Config } from "./types.ts";

const _Emmiter = new Event();
let lite_path = null;
function verify(dpath="", dname=""){
	if (
		dpath &&
		typeof dpath === "string" &&
		dpath.length > 0 &&
		dname &&
		typeof dname === "string" &&
		dname.length > 0
	) {
		return { dpath, dname };
	}
	throw new Error("liteq: valid options required, path && dbname ").message;
}

export class Liteq {
	#k;
	#full_db_path;
	#dpath;
	#dname;
	#conf_path;
	#useTtl ;
	helpers: { encrypt: (text?: string) => string; decrypt: (text?: string) => (Buffer<ArrayBufferLike> & string) | undefined; genUuid: (n?: number) => string; };
	
	constructor(opts = { dbpath: join(process.cwd(), ""), dbname: "b" }) {
		const { dpath, dname } = verify(opts.dbpath, opts.dbname);
		this.#full_db_path = join(dpath, dname);
		this.#dpath = dpath;
		this.#dname = dname;
		this.#k = `${dname}_liteqversion1_bun`;
        this.#conf_path = join(this.#full_db_path.trim(),"./config.liteq")
		
		this.helpers = {
			encrypt:(text="")=>{
			  if(!text || typeof text !== "string" || text.length === 0){
				throw new Error("liteq: text must be string and not empty")
			  }
			  return String(encrypt(text,this.#k).full)
			},
			decrypt:(text="")=>{
			  if(!text || typeof text !== "string" || text.length === 0){
				throw new Error("liteq: text must be encrypted string and not empty")
			  }
			  let iv = text.slice(0,32)
			  let hash = text.slice(32);
			  let decrypted = decrypt(hash,iv,this.#k)
			 
			  if(decrypted){
			  return decrypted
			  }
			},
			genUuid:(n=16)=>{
			  if(n && typeof n === "number" && n >= 16){
				return Bun.randomUUIDv7("hex") || nanoid(n);
			  }
			  throw new Error("liteq: genUuid requires number greater than 16 === 16")
			 
			}
		  }
		// init
		if (!existsSync(this.#full_db_path)) {
			//init db  morrow take config and set
			try {
            mkdirSync(this.#full_db_path,{recursive:true})
			
			} catch (error) {
				 throw new Error("liteq: failed to initialize db")
			}   
			 
		}
		if (!existsSync(this.#conf_path)) {
			createFile(this.#conf_path)
			let delay_timeout = setTimeout(()=>{
			   writeConfig(this.#conf_path,{docs:[],count:0}) 
			   clearTimeout(delay_timeout)
			},2)  
		}  
		
		this.#useTtl= ()=>{
			let i = setInterval(async ()=>{
			  clearInterval(i)
			  const config = await loadConfig(this.#conf_path)
			  config?.docs.forEach(_conf =>{
			  if(_conf.ttl !== 0 && Number(_conf.ttl) + Number(1) <= Date.now()){
				this.remove(_conf.key)
			  }
			  })
			
			},1000)  
		  }
		  this.#useTtl()
		
		return this; 
	}   

	get path() {
		return this.#dpath;
	} 

	get name() {
		return this.#dname;
	}
	async info(){
		const config = await loadConfig(this.#conf_path)
		return config
	}
	/**
	 * @info -listen to db changes
	 * @param cb - callback function
	 */
	onChange(cb = (ev: ReturnData)=>{}){
		if(cb && typeof cb === "function"){
		 _Emmiter.on("change",(data)=>{
			return cb(data.data)
		 })
		} 
	 } 

	/**
	 * @param id -get item by its id.
	 * @param cb - callback function to listen to.
	 * @example await get("one")
	 */
	async get(id:string, cb: (ev: ReturnData | null)=>{}): Promise<ReturnData | null>{
		if (!id || typeof id !== "string" || id.length === 0) {
			return Promise.reject(new Error("liteq: get,requires id"));
		}
		try{
		   const config:Config = await loadConfig(this.#conf_path)
           let found:ReturnData | undefined = config?.docs.find(_doc => _doc.key === id);
		   if(found){
            _Emmiter.on("change",(data)=>{
                if(cb && typeof cb === "function"){
					if(data.data.key === id)
					cb(data.data);
				}

			})
		   return new Promise((resolve,reject)=>{
		   const timmer = setTimeout(async ()=>{
			const doc = await getDocumentById(id,this.#full_db_path);
		    
			found.data = doc//todo morro wait for write
		     resolve(found)
			 clearTimeout(timmer)
		   },100)
		     })
		   }
		   if(cb && typeof cb === "function")cb(null)
		     return Promise.resolve(null)
		}catch(err){
			return Promise.reject(err)
		}
	
	}
	/**
	 * @param id - document id to set,default autogen.
	 * @param data  -document to save.
	 * @param ttl -time to expire in number,defaults to 0 no expiry.
	 */

	async set(id = Bun.randomUUIDv7("hex") || nanoid(16), data = {}, ttl = 0) {
		if (
			(!id && typeof id !== "string") ||
			(id.length === 0 && !data) ||
			(typeof data !== typeof {} && typeof ttl !== "number")
		) {
			return Promise.reject(
				new Error("liteq: set,requires valid options,id,data and optional ttl"),
			);
		}
		try {
			const config: Config = await loadConfig(this.#conf_path)
			const found: ReturnData = config?.docs?.find((c) => c.key === id);
			const data_to_save: ReturnData = await getDocumentById(found?.key,this.#full_db_path);
			const filtered = config?.docs?.filter((c) => c.key !== id);
			if(found){
				// update
				data_to_save._attachments = found?._attachments || [];
				data_to_save.data = loopMerged(deepmerge(data_to_save.data, data));
             
				await putDocumentById(id,data_to_save.data,this.#full_db_path)
				// config update
				found.ttl = ttl;
				found.updated_at = Date.now();
				filtered.push(found);
				// write
				if(config){
				config.docs = filtered;
				const conf_timmer = setTimeout(async()=>{
                 await writeConfig(this.#conf_path,config);
				 clearTimeout(conf_timmer)
				},2)
                }
				const timmer = setTimeout(()=>{
					found.data= data_to_save.data 
					_Emmiter.emit("change",found)  
					clearTimeout(timmer)
				},2)
				
				return Promise.resolve(found);
			}
			// save new
			const newdata = {
				key: id,
				ttl,
				created_at: Date.now(),
				updated_at: Date.now(),
				_attachments: [],
			};
			if(config){
			config?.docs.push(newdata);
            config.count = config?.count + 1;
			const conftimmer = setTimeout(async()=>{
				await writeConfig(this.#conf_path,config);
				clearTimeout(conftimmer)
			   },2)  
             }
            
			await putDocumentById(id,data_to_save?.data,this.#full_db_path) 
			 setTimeout(()=>{  
                _Emmiter.emit("change",{    
					_id: newdata.key, 
					data,
					ttl: newdata.ttl,
					created_at: newdata.created_at,
					updated_at: newdata.updated_at,
					_attachments:newdata._attachments
				})
			 },2)
			
			
			return Promise.resolve({
				_id: newdata.key,
				data,
				ttl: newdata.ttl,
				created_at: newdata.created_at,
				updated_at: newdata.updated_at,
				_attachments:newdata._attachments
			});
		} catch (error) {
			return Promise.reject(error); 
		}
	}
	async remove(id = ""){
      if(!id || typeof id !== "string" || id.length === 0)return Promise.reject(new Error("liteq: remove requires valid id"));
     
	  try {
		const config: Config = await loadConfig(this.#conf_path)
		if(config){
			const found: ReturnData = config.docs.find(d=> d.key === id);
			if(!found)return Promise.resolve({
				iserror:true,
				msg:"not found",
				id
			})
			//attachments
		   const removed = await removeDocument(id,this.#full_db_path);
			for(const doc of found._attachments){
			  await removeAttachment(doc.id || doc,this.#full_db_path)
			}
			const filtered = config?.docs.filter((c) => c.key !== id);
			config.count = config.count - 1;
			config.docs = filtered 

			await writeConfig(this.#conf_path,config)
			setTimeout(()=>_Emmiter.emit("remove",removed),8)
			return Promise.resolve(removed)
			}
	  } catch (error) {
		return Promise.reject(error)
	  }
	}
	onRemoved(cb=(ev: {iserror:boolean,msg:string,id:string})=>{}){
		if(cb && typeof cb === "function"){
		  _Emmiter.on("remove",(data)=>{
			return cb(data.data)
		  })
		 }
	  }
	async clear(){
		try{
			const config: Config = await loadConfig(this.#conf_path)
			for await(let doc of config.docs){
              const removed = await removeDocument(doc.key,this.#full_db_path)
			  for(const _att of doc._attachments){
				await removeAttachment(doc.id || _att,this.#full_db_path)
			  }
			   setTimeout(()=>{
				_Emmiter.emit("clear",removed)
			},8) 
			}
			await writeConfig(this.#conf_path,{docs:[],count:0})
		}catch(err){
			return Promise.reject(err)
		}
	}
	async getKeys(){
	
		let config = await this.info()
		let keys=[]
		for(let ke of config.docs){
		  keys.push(ke.key)
		}
		 return {
		  keys:keys,
		  count:config.length
		 }  
	  }
	  onCleared(cb = ()=>{}){
		if(cb && typeof cb === "function"){
		  _Emmiter.on("clear",(data)=>{
			return cb(data)
		  })
		 }
	  } 

	  getSize(){
	
	    return new Promise((resolve,reject)=>{
		stat(this.#full_db_path, async (err, stats) => {
		  if (!err) {
			if(stats){
			  resolve(bytesForHuman(stats.blksize))
			}
		  }else{
		  
			resolve(bytesForHuman(0))
		  } 
		})})
	  }
	    //attachments
  attachments={
    image: {
     get:async (opts={docid:"",id:""})=>{
        if(!opts || checktype(opts) !== checktype({})  || !opts.docid || typeof opts.docid !== "string" || opts.docid.length === 0 || !opts.id || typeof opts.id !== "string" || opts.id.length === 0)
        {
          return{
            iserror:true,
            msg:"valid options required",
            image:null,
            error:null
          }
        }
		     const config = await loadConfig(this.#conf_path)
              let found = config?.docs.find((c)=>c.key === opts.docid)
              if(!found){
                return {
                  iserror:true,
                  msg:"document not found",
                  image:null,
                  error:null
                }
              }
              //found 
            return {
				iserror:false,
				msg:"success",
				image:await getImage(opts.id,this.#full_db_path),
				error:null
			  }

        },
    getAll:async (id="")=>{
      if(id && typeof id === "string" && id.length > 0){
		const config = await loadConfig(this.#conf_path)
		let found = config?.docs.find((c)=>c.key === id)
	
        if(!found){
          return {
            iserror:true,
            msg:"document not found",
            image:null,
            error:null
          }
        }
        //found
		for await (let img of found._attachments){
			if(img.type === "image"){
				let all_get_promises = [];
				all_get_promises.push(this.attachments.image.get(id,img.id))
				return Promise.all(all_get_promises)
			}
			
		}
        
     
      }else{
        return{
          iserror:true,
          msg:"document id required",
          image:null,
          error:null
        }
      }
    },
    put:async (id="",image="")=>{
            if(id && typeof id === "string" && id.length > 0 && image && image.length !== 0 && typeof image !== "number"){
				const config = await loadConfig(this.#conf_path)
				let found = config?.docs.find((c)=>c.key === id)
		
              if(!found){
                return {
                  iserror:true,
                  msg:"document not found",
                  image:null,
                  error:null
                }
              }
              //found 
			  
              //put
             return await putImage(image,this.#full_db_path,id)
           
            }else{
              return{
                iserror:true,
                msg:"document id and image url or blob required",
                image:null,
                error:null
              }
            }
        },
        remove:async (opts={docid:"",id:""})=>{
          if(!opts || checktype(opts) !== checktype({})  || !opts.docid || typeof opts.docid !== "string" || opts.docid.length === 0 || !opts.id || typeof opts.id !== "string" || opts.id.length === 0)
          {
            return{
              iserror:true,
              msg:"valid options required",
              image:null,
              error:null
            }
          }
                //find doc by id
                let config = await this.info()
                let found = config?.docs.find((c)=> c.key === opts.docid)
                if(!found){
                  return {
                    iserror:true,
                    msg:"document not found",
                    image:null,
                    error:null
                  }
                }
                //found 
              return await removeImage(found,opts.id,this.#full_db_path)
          }
  },
  file:{
	/**
	 * 
	 * @param docid {string} - document id.
	 * @param file  {Blob} - file to attach,image,video etc.
	 * @returns Promise
	 */
	put: async (docid: string="",file:Blob)=>{
       try {
		if(!docid || typeof docid !== "string" || docid.length === 0 || !file){
			return {
				iserror:true,
				msg:"docid and file blob required",
				file:null,
				error:null
			  }
		}
		const config = await this.info();
		
		let filtered = config?.docs.filter( doc => doc.key !== docid)
		let found = config?.docs.find( doc => doc.key === docid)
		console.log(found)

	  if(!found){
		return {
		  iserror:true,
		  msg:"document not found",
		  image:null,
		  error:null
		}
	  }
		if(file instanceof Blob){
			
          let res = await putFileAttachment(file,this.#full_db_path);
		
		  if(res && res.msg === "success"){
			//update config
			
				found.updated_at = Date.now()
			   found._attachments.push(res.file)
			   filtered.push(found)
			   config.docs = filtered
			   await writeConfig(join(this.#full_db_path,'./config.liteq'),config)
			  
              return res
		  }
            return res
		
		}else{
			return {
				iserror:true,
				msg:"file not instance of Blob",
				file:null,
				error:null
			  }
		}


	   } catch (error) {
		return {
			iserror:true,
			msg:"error occurred ",
			file:null,
			error
		  }
	   }
	}
  },
info: async (docid="")=>{
	try{
  if(docid && typeof docid === "string" && docid.length > 0){
	let config = await this.info();
	let found = config?.docs.find((c)=> c.key === docid)
	if(!found){
	  return {
		iserror:true,
		msg:"document not found",
		attachments:[],
		error:null
	  }
	}
	//
	return {
		iserror:false,
		msg:"success",
		attachments: found._attachments,
		error:null
	}
  }
}catch(err){
	return {
		iserror:true,
		msg:"error occurred",
		attachment:[],
		error:err
	}
  }

  }

}

}



