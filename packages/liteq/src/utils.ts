import { writeFileSync,readFileSync,rmSync,createWriteStream, createReadStream } from "node:fs"
import { join } from "node:path";
import { pipeline} from "node:stream";
import {UnpackrStream,PackrStream } from "msgpackr";
import  Zlib  from "node:zlib";
import {Writer} from "steno";
import {Pqueue} from "@pouchlab/worker-pool";

const Queue = new Pqueue();


export async function createFile(path: string) {
  try {
    const file =
			(await Bun.write(Bun.file(path), "")) || writeFileSync(path, "")
    return file
  }
 catch (_error) {
    return null
  }
}

export var checktype = ((global) => {
  const cache = {}
  return (obj: { nodeType: any } | null | undefined) => {
    let key
    return obj === null
      ? "null" // null
      : obj === global
        ? "global" // window in browser or global in nodejs
        : (key = typeof obj) !== "object"
            ? key // basic: string, boolean, number, undefined, function
            : obj.nodeType
              ? "object" // DOM element
              : cache[(key = {}.toString.call(obj))] || // cached. date, regexp, error, object, array, math
							(cache[key] = key.slice(8, -1).toLowerCase()) // get XXXX from [object XXXX], and cache it
  };
})(this)

export function bytesForHuman(bytes: number, decimals = 2) {
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  let i = 0
  for (i; bytes > 1024; i++) {
    bytes /= 1024
  }
  return `${Number.parseFloat(bytes.toFixed(decimals))} ${units[i]}`
}

// unique method
function uniqueDeepArr(arr: any[]) {
  const arrUniq = [...new Map(arr.slice().map((v: { id: any }) => [v.id, v])).values()] // .reverse()
  const map = new Map()
  const deeparr = []
  for (const i in arrUniq) {
    for (const d in arrUniq[i]) {
      map.set(d, arrUniq[i][d])
      if (checktype(map.get(d)) === checktype([])) {
        const unique = []

        // objects
        const obarr = []
        const sarr = []
        const narr = []
        // loop props
        for (const val of map.get(d)) {
          if (checktype(val) === checktype({})) {
            obarr.push(val)
          }
          if (checktype(val) === "string") {
            sarr.push(val)
          }
          if (checktype(val) === "number") {
            narr.push(val)
          }
        }
        // objects
        for (const f of uniqueDeepArr(obarr)) {
          unique.push(f)
        }
        // strings
        for (const f of removeDuplicate(sarr)) {
          unique.push(f)
        }
        // numbers
        for (const f of removeDuplicate(narr)) {
          unique.push(f)
        } // the other way

        // concurent
        map.set(d, unique)
        deeparr.push(Object.fromEntries(map))
      }
 else {
        deeparr.push(Object.fromEntries(map))
      }
    }
  }

  return [...new Map(deeparr.slice().map((v) => [v.id, v])).values()]
}

function removeDuplicate(array: any[]) {
  return [...new Set(array.map((s: any) => JSON.stringify(s)))].map((s) =>
    JSON.parse(s),
  )
}
export function uniqueArr(arr: any) {
  const unique = []

  // objects
  const obarr = []
  const sarr = []
  const narr = []
  // loop props
  for (const val of arr) {
    if (checktype(val) === checktype({})) {
      obarr.push(val)
    }
    if (checktype(val) === "string") {
      sarr.push(val)
    }
    if (checktype(val) === "number") {
      narr.push(val)
    }
  }
  // objects
  for (const f of uniqueDeepArr(obarr)) {
    unique.push(f)
  }
  // strings
  for (const f of removeDuplicate(sarr)) {
    unique.push(f)
  }
  // numbers
  for (const f of removeDuplicate(narr)) {
    unique.push(f)
  }

  return unique
}

// loop merged

export function loopMerged(merged: { [x: string]: any }) {
  const map_to_save = new Map()
  // loop keys
  for (const i in merged) {
    const full_key_value = merged[i]
    // check for array
    if (checktype(full_key_value) === checktype([])) {
      map_to_save.set(i, uniqueArr(full_key_value))
    }
 else {
      map_to_save.set(i, merged[i])
    }
  }
  return Object.fromEntries(map_to_save)
}

export async function compressData(data:any,path:string){
  return new Promise((resolve,reject)=>{
  try {
  let compressPackStream = new PackrStream();
  let file =new Writer(path);//Bun.file(path) || createWriteStream(path);
  compressPackStream.write(data);
  compressPackStream.on("data", packed =>{
  file.write(Zlib.brotliCompressSync(packed));
   resolve(true)
  })  
  compressPackStream.end();      
  } catch (error) {  
    reject(error)
  }
})
}
export async function decompressData(path=""){
  return new Promise((resolve,reject)=>{
  try {
    const uncompressStream = new UnpackrStream();
    path = path || join(process.cwd(),"./b/one.liteq")
    const file = createReadStream(path);
    const pipe = pipeline(file,Zlib.createBrotliDecompress(),uncompressStream,(err)=>{
      if(err){
        reject(err)
      }
    })
  pipe.on("finish",()=>{
    resolve(pipe.read())
  }) 
  } catch (error){
    reject(error)
  }
})
}

export async function loadConfig(path=""){
  try {
    return await decompressData(path)
  } catch (error) {
    return null
  }
}


 
export async function writeConfig(path="",data:any){
  try {
  return await  compressData(data,path)
  } catch (error) {
    return null
  }
}
Queue.addJob({id:"test",fn:async (path)=>{
  const Zlib = await import("node:zlib");
  const {UnpackrStream} = await import("msgpackr");
  const {createReadStream} = await import("node:fs");
  const {join} = await import("node:path");
  const {pipeline} = await import("node:stream");

  return new Promise((resolve,reject)=>{
    try {
      const uncompressStream = new UnpackrStream();
     const  path = join(process.cwd(),"./b/one.liteq")
      const file = createReadStream(path);
      const pipe = pipeline(file,Zlib.createBrotliDecompress(),uncompressStream,(err)=>{
        if(err){ 
          reject(err)
        }
      })
    pipe.on("finish",()=>{
      console.log("bb")
      resolve(pipe.read())
    }) 
    } catch (error){
      reject(error)
    } 
  }) 
}},(ev)=>{
  console.log(ev,"ev")
})
Queue.onCompleted(d=>console.log(d,"d")) 
Queue.onError(e=>console.log(e,"e"))
export async function getDocumentById(id="",dpath=""){
  try {
    const path = join(dpath,`${id}.liteq`)
      return await decompressData(path)
   } catch (error) {
      return null
   }
}
export async function putDocumentById(id="",data={},dpath=""){
  try {
   const path = join(dpath,`${id}.liteq`)
   await compressData(data,path)
   return data
  } catch (error) {
     return null
  }
}

export async function removeDocument(id="",dpath=""){
    try {
      let filepath = join(dpath,`${id}.liteq`);
      Bun.file(filepath).delete() || rmSync(filepath,{recursive:true,retryDelay:101});
     return  Promise.resolve({iserror:false,msg:"document removed",id})
    } catch (error){ 
     return Promise.reject({iserror:true,msg:"document removed",id:null})
    }
   
   

}
export async function removeAttachment(att="",dpath="") {
  try {
    let filepath = join(dpath,`./attachments/${att}.liteq`);
      Bun.file(filepath).delete() || rmSync(filepath,{recursive:true,retryDelay:101});
     return  Promise.resolve({iserror:false,msg:"attachment removed",file:att})
  } catch (error) {
    return Promise.reject({iserror:true,msg:"attachment removed",file:null})
  }
} 