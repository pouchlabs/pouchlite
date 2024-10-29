import {join} from "path";
import { genUuid,createFolder,checktype,bytesForHuman,removeListDuplicate } from "./utils.js";
import { Liteq } from "@pouchlab/liteq";
import Event from "eventemitter3";
import deepmerge from "deepmerge";
import fs from "fs"
import z from "zod"
import { CreateClient } from "@pouchlab/realtor";

const Emmitter = new Event();

function verifySchema(schema,data){
   let valid = schema.safeParse(data);
   console.log(valid)
}
//remove
function removeDocument(data){
 console.log(data)
}
class Collection{
    #config
    #meta
    #schema
    #indexes
    #dbconf
    constructor(meta,db){
    if(!fs.existsSync(meta.path)){
      fs.mkdirSync(meta.path,true)
    }
       this.#config = new Liteq({dpath:meta.path,dbname:"meta"})
       this.#schema = null;
       this.#meta = meta;
       this.#indexes = [];
       this.#dbconf=db
       this.#config.onRemoved((data)=>{
         removeDocument(data)
       })
    }
    get meta(){
        return this.#meta = deepmerge(this.#meta,{docs:this.#config.getKeys().keys,count:
            this.#config.getKeys().count
        });
    }
    get indexes(){
        return this.#indexes;
    }

   async put(opts={id:"",data:{}}){
        if(!opts || checktype(opts) !== checktype({}) ){
            throw new Error("pouchlite: opts must be valid json object")
          }
      if(opts.id && typeof opts.id !== "string" &&  opts.id.length === 0 && checktype(opts.data) !== checktype({})){
         throw new Error("pouchlite: put requires valid data object and optional id string or ttl")
      }
      let id = opts.id;
      let data = opts.data || {};
      let db = new Liteq({dpath:this.#meta.path,dbname:this.#meta.name})
      let found = await this.#config.get(id);
      if(!found){
        //not found
        let newdoc = {
            id,
            created_at:Date.now(),
            updated_at:Date.now()

        }
        //save config
        this.#config.set(id,{})
        //save to db
        db.set(id,data)
        newdoc.data = data
        return new Promise((resolve)=>{
            Emmitter.emit("change_",newdoc)
            resolve({msg:"success",doc:newdoc})
        })
      
      }
      return new Promise((resolve)=>{
          //save config
          this.#config.set(id,{})
          //save to db
          db.set(id,data)
          db.get(id).then(d=>{
            Emmitter.emit("change_",d)
            resolve({msg:"success",doc:d})
          })
       
      })
    }
    putMany(opts=[{id:"",data:{}}]){
       if(opts && checktype(opts) !== checktype([{}]) || opts.length=== 0 || opts.length > 30){
        throw new Error("pouchlite: putMany requires valid array of objects,limit 30")
       }
      let success = false;
       opts.forEach(async (doc)=>{
        if(doc.id && typeof doc.id === "string" && doc.id.length > 0){
            this.put({id:doc.id,data:doc.data})   
           success = true
        }else{
            success = false
            throw new Error("pouchlite: opts.id should be a string not empty,data should be object")
        }

       })
       if(success){
        return new Promise((resolve)=>{
            resolve({msg:"success",doc:opts})
          })
       }
    }
  async get(id=""){
    if(typeof id !== "string" || id.length === 0){
      throw new Error("pouchlite: get requires id string")
    }
    return new Promise((resolve)=>{
      let db = new Liteq({dpath:this.#meta.path,dbname:this.#meta.name})
      let keys = this.#config.getKeys().keys;
      let found = keys.find((k)=> k === id)
      if(found){ 
            db.get(found).then(d=>{
              resolve({msg:"success",doc:d})
            })
          
        return 
      }
      resolve({msg:"not found",doc:null})
    })

  }
  getMany(ids=[""]){
        if(ids && checktype(ids) !== checktype([""]) || ids.length === 0 || ids.length > 30 ){
          throw new Error("pouchlite: getMany requires valid array of string id,limit 30")
        }
        let db = new Liteq({dpath:this.#meta.path,dbname:this.#meta.name})
        let filtered = []
        let newlist = removeListDuplicate(ids)
        newlist.forEach(async(id)=>{
          let found = db.getKeys().keys.find((i)=> i === id );
          if(found && id)filtered.push(found);
        })
        if(filtered){
          return new Promise((resolve)=>{
              let docs = []
             filtered.forEach(async (id)=>{
          
             let d = await db.get(id)
              docs.push(d)
                 setTimeout(()=>{
                  resolve({msg:"success",doc:docs})
                 },9)
                
              
             })
          })
         
        }
  }

  change(cb){
    if(cb && typeof cb === "function"){
      let db = new Liteq({dpath:this.#meta.path,dbname:this.#meta.name})
        Emmitter.on("change_",(data)=>{
          cb(data)
        })
      }else{
       throw new Error("pouchlite: cb function required")
      }
}
async sync(url=""){
  if(typeof url !== "string" || url.length === 0){
    throw new Error("pouchlite: sync requires lite-server url string")
  }
  let validurl = z.string().url().safeParse(url);
  if(validurl.success){
   let  uri = validurl.data
   let client = CreateClient(uri); 
   client.onConnected(()=>{ 
    //initials
    client.emit("from_client_user",{user:client.id,db:this.#dbconf.name},(res)=>{
     // console.log(res,"res") 
     })
     let keys = this.#config.getKeys().keys;
     let db = new Liteq({dpath:this.#meta.path,dbname:this.#meta.name})
     keys.forEach(async k=>{
        let doc = await db.get(k)
        client.emit("full_sync_client",{id:doc._id,db:this.#dbconf.name,collection:this.#meta.name,document:doc},(res)=>{

        }) 
     })

   
   })
   //change emit
   function syncChange(data){
    console.log(data,"dg")
    client.emit("client_change",data,(res)=>{ 
     console.log(res) 
    })
   }
this.change(syncChange) 

          //change
          client.on("server_change",(data)=>{ 
            console.log("server change")
         })
         client.on("me",async(data)=>{ 
          //console.log(data)
          if(data.data.doc){
            let db = new Liteq({dpath:this.#meta.path,dbname:this.#meta.name})
            let d = await db.get(data.data.doc._id);
            if(d && d.msg === "success"){
              if(d.doc.updated_at === data.data.doc.updated_at){
                console.log("is there") 
              }
            }
          }
       })

    return
  }
  throw new Error("pouchlite: sync requires lite-server url string")

}
    defineSchema(schema){
       if(!schema || !schema._parse){
        throw new Error("pouchlite: valid zod schema required")
       }
       this.#schema = schema
    }
    index={
      set:(name="",obj={entry:"",value:""})=>{
         if(!name || typeof name !== "string" || name.length === 0 || checktype(obj) !== checktype({}) || !obj.entry || typeof obj.entry !== "string" || obj.entry.length === 0 || !obj.value || typeof obj.value !== "string" || obj.value.length === 0){
            throw new Error("pouchlite: index set requires valid index name and obj");
         }
         let found = this.#indexes.find((i)=> i.name === name);
         if(!found){
            let newindex = {
                name,
                entry:obj.entry,
                value:obj.value,
                docs:[],
                count:0
             }
             this.#indexes.push(newindex)
             return "success"
         }
         return "exists"

      },
      delete:(name="")=>{
        if(name && typeof name === "string" && !name.length===0){
           let filtered = this.#indexes.filter((i)=>i.name !== name);
           if(filtered){
            this.#indexes=filtered;
            return "success"
           }
           return "not found"
        }
      },
      clear:()=>{
        this.#indexes=[]
        return "success"
      }
    }
}

export function  currentCol(name,meta,config){
    let dbconf = JSON.parse(JSON.stringify(meta));

   let found = dbconf.cols.find((col)=> col.name === name);
   if(found){
    //use
    return new Collection(found,dbconf)
   }
   //create new
   let colpath = join(dbconf.path,name)
   let newcol = {
    id:genUuid(),
    name,
    path:colpath,
    docs:[],
    count:0,
    created_at:Date.now()
   }
   dbconf.cols.push(newcol)
   dbconf.cols_count = dbconf.cols_count+1;
    createFolder(colpath,(res)=>{
       if(res === "success"){
        config.set(dbconf.name,dbconf) 
       }
    })
   return new Collection(newcol,dbconf)
}