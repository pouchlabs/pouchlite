import AdmZip from "adm-zip"
import deepmerge from "deepmerge";
import Event from "eventemitter3";
import fs from "fs"
import { join ,parse} from 'path';
import {encrypt,decrypt} from './service-enc.js';
import { encode,decode } from "msgpack-lite";
import {nanoid} from "nanoid";

const Emmiter = new Event();
var checktype = (function(global) {
  var cache = {}; 
  return function(obj) {
      var key;
      return obj === null ? 'null' // null
          : obj === global ? 'global' // window in browser or global in nodejs
          : (key = typeof obj) !== 'object' ? key // basic: string, boolean, number, undefined, function
          : obj.nodeType ? 'object' // DOM element
          : cache[key = ({}).toString.call(obj)] // cached. date, regexp, error, object, array, math
          || (cache[key] = key.slice(8, -1).toLowerCase()); // get XXXX from [object XXXX], and cache it
  };
}(this));


function bytesForHuman(bytes, decimals = 2) {
  let units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB','EB', 'ZB', 'YB']
  let i = 0
  for (i; bytes > 1024; i++) {
      bytes /= 1024;
  }
  return parseFloat(bytes.toFixed(decimals)) + ' ' + units[i]
}

function verify(dpath,dbname){
  if(dpath === undefined || typeof dpath !== "string" || dpath.length === 0){
    throw new Error("liteq: dpath must be valid folder path");
  }
  if(dbname === undefined || typeof dbname !== "string" || dbname.length === 0 || dbname.length < 3){
    throw new Error("liteq: dbname must be any name without extension at end and atleast 3 chars and above");
  }
  if(dpath){
    if(parse(dpath).ext){
      throw new Error("liteq: dpath must be valid folder path")
    }
 fs.stat(dpath, async (err, stats) => {
  if(err){
    //create
    fs.mkdirSync(dpath,true)
  }
});
  }
}

//listeners
//writer
Emmiter.on("write",async(data)=>{
try {
  let fulldpath = join(data.dbpath,data.db+".liteq")
  if(!fs.existsSync(fulldpath)){
   const z= new AdmZip()
   z.addFile("config.lite",encode([])) 
   z.writeZip(fulldpath)
  }else{

  
   const zip = new AdmZip(fulldpath)
   let config = decode(zip.getEntry("config.lite").getData())
   let found = config.find((c)=>c.key === data.key);
   let filtered = config.filter(c=>c.key !== data.key);
  
  if(found){
   //found just update
   let file_to_update = decode(zip.getEntry(data.key+".msp").getData())
    zip.updateFile(data.key+".msp",encode(deepmerge(file_to_update,data.data)))
    //conf
    filtered.push(deepmerge(found,{ttl:data.ttl,updated_at:Date.now()}))
    zip.getEntry("config.lite").setData(encode(filtered))
    //zip.writeZip()
    Emmiter.emit("change",{key:data.key,data:data.data,ttl:data.ttl})
    Emmiter.emit("change_"+data.key,{key:data.key,data:data.data,ttl:data.ttl})
    zip.writeZip(fulldpath)
  }else{ 
    //save new
    
     config.push({key:data.key,ttl:data.ttl,created_at:Date.now(),updated_at:Date.now()})
     zip.updateFile("config.lite",encode(config))
     zip.addFile(data.key+".msp",encode(data.data)) 
  
     Emmiter.emit("change",{key:data.key,data:data.data,ttl:data.ttl})
     Emmiter.emit("change_"+data.key,{key:data.key,data:data.data,ttl:data.ttl})
     zip.writeZip(fulldpath)
    }
  }
} catch (error) { 
  console.log(error)
  throw new Error("liteq: broken database")
}   
})

//delete
Emmiter.on("delete",(data)=>{
  let fulldpath = join(data.dbpath,data.db+".liteq")
  if(!fs.existsSync(fulldpath)){
    const z= new AdmZip()
    z.addFile("config.lite",encode([])) 
    z.writeZip(fulldpath)
    return
   }
  let zip = new AdmZip(fulldpath)
  let config = decode(zip.getEntry("config.lite").getData())
  let filtered = config.filter((c)=>c.key !== data.key);
   let found = config.find((c)=>c.key === data.key)
   if(found){
    //remove
     zip.updateFile("config.lite",encode(filtered))
     zip.deleteFile(data.key+".msp")
     zip.writeZip(fulldpath)
     Emmiter.emit("remove_found"+data.key)
     Emmiter.emit("remove",{key:data.key})
   }else{
    //not found
     Emmiter.emit("remove_not_found"+data.key)
   }
})


export class Liteq {
  #dbname
  #dbpath
  #init
  #k
  #useTtl
  constructor(opts={dpath:"",dbname:""}) {
    if(!opts || checktype(opts) !== checktype({})){
      throw new Error("liteq: valid object params required")
    }
    verify(opts.dpath,opts.dbname)
    this.#dbpath = join(opts.dpath)
    this.#dbname = join(this.#dbpath,parse(opts.dbname).name+".liteq"); 
    this.dpath=this.#dbpath
    this.dbname = parse(opts.dbname).name
    this.#k =  this.dbname.slice(0,3)+"_liteqversion_one@pouchlitev1"
    this.helpers={
      encrypt:(text)=>{
        if(!text || typeof text !== "string" || text.length === 0){
          throw new Error("liteq: text must be string and not empty")
        }
        return String(encrypt(text,this.#k).full)
      },
      decrypt:(text)=>{
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
          return nanoid(n)
        }
        throw new Error("liteq: genUuid requires number greater than 16 === 16")
       
      }
    }

    this.#init=()=>{
        fs.stat(this.#dbname,(err)=>{
          if(err){
            const zip = new AdmZip();
           zip.addFile("config.lite",encode([])) 
           zip.writeZip(this.#dbname)
          } 
        })
    }  
    this.#init()
    this.#useTtl=()=>{
      let i = setInterval(async ()=>{
        clearInterval(i)
        let fulldpath = join(this.dpath,this.dbname+".liteq")
        let zip = new AdmZip(fulldpath)
        let config = decode(zip.getEntry("config.lite").getData())
        config.forEach(c=>{
        if(c.ttl !== null && c.ttl !== false && Number(c.ttl) <= Date.now().toFixed()){
          this.remove(c.key)
        }
        })
      
      },200)
    }
    this.#useTtl()
  }   
  set(key,obj,ttl) {
    
    if(!key || typeof key !== "string" || key.length === 0){
      throw new Error("liteq: key must be string and not empty")
    }
    if(!obj || checktype(obj) !== checktype({}) ){
      throw new Error("liteq: obj must be valid json object")
    }
    if(ttl && typeof ttl !== "number" || ttl < 1000 || ttl === 1000 ){
      throw new Error("liteq: ttl must be number above 1000")
    }
  let time = ttl || null;

 let st =setTimeout(()=>{
  Emmiter.emit("write",{db:this.dbname,dbpath:this.#dbpath,key,ttl:time,data:obj})

  clearTimeout(st)
 },3)

 return new Promise((resolve)=>{
  Emmiter.once("change_"+key,(data)=>{
    resolve(data)
   })

 })

 } 
  get(key){
    if(!key || typeof key !== "string" || key.length === 0){
      throw new Error("liteq: key must be string and not empty")
    }
setTimeout(()=>{
  if(!fs.existsSync(this.#dbname)){
    const z= new AdmZip()
    z.addFile("config.lite",encode([])) 
    z.writeZip(this.#dbname)
    return 
   }
  const zip = new AdmZip(this.#dbname)
  let config = decode(zip.getEntry("config.lite").getData())
 
  let found = config.find((c)=>c.key === key)

  if(found){
    let meta = {
      created_at:found.created_at,
      updated_at:found.updated_at,
      ttl:found.ttl,
      _id:found.key
    }
    Emmiter.emit("found_get_"+key,deepmerge(decode(zip.getEntry(found.key+".msp").getData()),meta))
   return 
  }else{
    Emmiter.emit("found_get_"+key,null)
  } 
  

 },7)
 return new Promise((resolve)=>{
  Emmiter.once("found_get_"+key,(data)=>{
     if(data){
       resolve(data)
     }else{
       resolve(data)
     }
  })
 })
 
  }
  remove(key=""){
    if(!key || typeof key !== "string" || key.length === 0 ){
      throw new Error("liteq: key string required and not empty")
    }
   let rmt = setTimeout(()=>{
     Emmiter.emit("delete",{db:this.dbname,dbpath:this.#dbpath,key})
    clearTimeout(rmt)
   },4)
   return new Promise((resolve,reject)=>{
    Emmiter.once("remove_not_found"+key,()=>{
      resolve("not found")
     })
     Emmiter.once("remove_found"+key,()=>{
      resolve("success")
     })
  
   })


 
  }
  onRemoved(cb){
    if(cb && typeof cb === "function"){
      Emmiter.on("remove",(data)=>{
        return cb(data)
      })
     }
  }

  clear(cb){
    if(cb && typeof cb === "function"){
      setTimeout(()=>{
        const zip = new AdmZip(this.#dbname)
        let config = decode(zip.getEntry("config.lite").getData())
        config.forEach(c=>{
          zip.deleteFile(c.key+".msp")
          zip.getEntry("config.lite").setData(encode([]))
          zip.writeZip()
        })
        Emmiter.emit("clear")
        cb("success")
      },8)
   
    }else{
      throw new Error("liteq: cb function is required")
    }
  
  } 
  change(cb){
   if(cb && typeof cb === "function"){
    Emmiter.on("change",(data)=>{
      return cb(data)
    })
   }
  }

  getSize(cb){
    if(!cb || typeof  cb !== "function") throw new Error("liteq: getSize requires a callback")

    fs.stat(this.#dbname, async (err, stats) => {
      if (!err) {
        if(stats){
      
          return cb(bytesForHuman(stats.size))
        }
      }else{
      
        return cb(bytesForHuman(0))
      } 
    })
  }
  getKeys(){
    const zip = new AdmZip(this.#dbname)
    let config = decode(zip.getEntry("config.lite").getData())
    let keys=[]
    for(let ke of config){
      keys.push(ke.key)
    }
     return {
      keys:keys,
      count:config.length
     }  
  }

  onCleared(cb){
    if(cb && typeof cb === "function"){
      Emmiter.on("clear",()=>{
        cb.call(arguments)
      })
     }
  } 
}

const usersdb = new Liteq({dpath:"/tmp",dbname:"users"})

console.log(await usersdb.get("hu"))
console.log(await usersdb.helpers.genUuid)