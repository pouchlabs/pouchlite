import { join } from "node:path";
import { writeFileSync,readFileSync,rmSync,createReadStream,createWriteStream ,existsSync, mkdirSync} from "node:fs"
import { pipeline,Writable,Readable } from "node:stream";
import {Jimp} from "jimp";
import { pack } from "msgpackr";
import {nanoid} from "nanoid";
import  Zlib  from "node:zlib";
import Event from "eventemitter3";
import { bytesForHuman,loadConfig,writeConfig } from "./utils.ts";

export const _Emmiter = new Event();
export async function decompressImage(compressed:any){
 try {
    const uncompressed = Bun.inflateSync(compressed) || Zlib.inflateSync(compressed);
    return uncompressed
 } catch (error) {
    return null
 }
}
export async function compressImage(image:any,path="",docid=""){
    
    try { 
       const br = Zlib.createBrotliCompress()
       const img = await Jimp.read(image) || Jimp.fromBuffer(image) || Jimp.fromBitmap(image);
      
        const img_blob = new Blob(await img.getBuffer(img.mime));
        let newimg = { 
          id:Bun.randomUUIDv7() || nanoid(16), 
          type:"image", 
          mime:img.mime,
          path:"",
          original_size:bytesForHuman(img_blob.size)
      }
       newimg.path = join(path,`./attachments/${newimg.id}.br`) 
        pipeline(img_blob.stream(),br,createWriteStream(newimg.path), async (err) => {
          if (err) {
            _Emmiter.emit("image_error",err)
          } else {
            
          //update config 
          const config = await loadConfig(join(path,'config.liteq'));
          if(config){
            let filtered = config.docs.filter(doc=>doc.key !== docid)
            let found = config.docs.find(doc=>doc.key === docid)
            if(found){
              found.updated_at = Date.now()
             found._attachments.push(newimg)
             filtered.push(found)
             config.docs = filtered
             await writeConfig(join(path,'config.liteq'),config)
            }
          }


           let st = setTimeout(()=>{
            _Emmiter.emit("image_created",newimg)
            clearTimeout(st)
          },2)
          }
        },)
      
     
    } catch (error) {
       return null
    }

   }
export async function getImage(id="",dpath=""){
    try {
        let path = join(dpath,`./attachments/${id}.liteq`);
        
      return Jimp.read(await decompressImage(await Bun.file(path).arrayBuffer()) || await decompressImage(readFileSync(path)))
    } catch (error) {
        return null
    }
}  
export async function putImage(image:any,path="",docid="") {
    try {
      if(!existsSync(join(path,"attachments"))){
        mkdirSync(join(path,"attachments"),{recursive:true})
      }
        return new Promise((resolve,reject)=>{
     compressImage(image,path,docid).then(()=>{
      _Emmiter.on("image_error",(err)=>{
      reject(err)
      })
      _Emmiter.on("image_created",(data)=>{
        resolve(data)
      })
     })
    }) 
    } catch (error) {
      return Promise.reject(error)
    }
}
export async function removeImage(found:any,id = "",path = ""){
 try {
  let path_to_remove = join(path,`./attachments/${id}.br`)
  if(found){
     let attachment_to_remove = found?._attachments.find( att => att.id === id)
     if(!attachment_to_remove)return Promise.resolve({
      iserror:true,
      msg:"attachment not found",
      id,
      error: null
     });
     //found
     await Bun.file(path_to_remove).delete() || rmSync(path_to_remove,{recursive:true});
     //update config
     const config = await loadConfig(join(path,'config.liteq'));
     if(config){
       let filtered = config.docs.filter( doc => doc.key !== found.key)
       let found = config.docs.find( doc => doc.key === found.key)
       if(found){
         found.updated_at = Date.now()
        found._attachments = found._attachments.filter(att => att.id !== id)
        filtered.push(found)
        config.docs = filtered
        await writeConfig(join(path,'config.liteq'),config)
        let st = setTimeout(()=>{
         _Emmiter.emit("attachment_removed",{
          iserror:false,
          msg:"success",
          id,
          error:null
        })
        },2)
        return Promise.resolve({
          iserror:false,
          msg:"success",
          id,
          error:null
        })
       }
     }     
  }
 } catch (error) {
  return Promise.reject({
    iserror:true,
    msg:"error occurred",
    id,
    error
  })
 }
}

export async function putFileAttachment(file:Blob,path=""){
  return new Promise((resolve,reject)=>{
  try {
    let newfile = {
      id:Bun.randomUUIDv7("hex") || nanoid(16),
      type:"file",
      path:"",
      mime:file.type,
      original_size:bytesForHuman(file.size)
    }
    newfile.path = join(path,`./attachments/${newfile.id}.br`);
    if(!existsSync(newfile.path)){
      mkdirSync(join(path,"./attachments"),{recursive:true})
    }
   pipeline(file.stream(),Zlib.createBrotliCompress(),createWriteStream(newfile.path,),(err)=>{
    if(err){
      reject({ 
      iserror:true,
      msg:"error occurred",
      file:null,
      error:err
    })
  }

   }).on("finish",()=>{
    resolve({
      iserror:false,
      msg:"success",
      file:newfile,
      error:null
    });
   })
  } catch (error) {
    reject({
      iserror:true,
      msg:"error occurred",
      file:null,
      error
    });
  }
  })
  
  // const worker =  new Worker(new URL("./s-worker.ts",import.meta.url)); 
  // let options={file,path}
  // worker.postMessage(options)


  // worker.onmessage = async (msg)=>{
  //   console.log(msg)
  // }
  // worker.onerror = (err)=>{
  //   console.log(err)
  // }
}