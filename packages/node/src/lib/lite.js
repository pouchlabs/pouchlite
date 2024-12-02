import fs from "fs";
import { parse,join } from "path";
import { checktype} from "./utils.js";
import {Liteq} from "@pouchlab/liteq";
import { Db } from "./db.js";

async function verify(path){
    if(path === undefined || typeof path !== "string" || path.length === 0){
      throw new Error("pouchlite: path must be valid folder path");
    }
    if(path){
      if(parse(path).ext){
        throw new Error("pouchlite: path must be valid folder path")
      }
      let litepath = join(path,".pouchlite")
      if(!fs.existsSync(join(path))){
        fs.mkdirSync(join(path),true)
        fs.mkdirSync(litepath,true)
      }else{
        if(!fs.existsSync(litepath)){
          fs.mkdirSync(join(litepath),true) 
        }
      }
    } 
  }

export default class Pouchlite{
    #path
    #litepath
    #config
    #k
    constructor(opts={path:process.cwd()}){
        if(!opts || checktype(opts) !== checktype({}))
            throw new Error("pouchlite: requires valid opts object")
       verify(opts.path) 
       this.#path = opts.path
   
       this.#litepath = join(this.#path,".pouchlite")
       this.#k = this.#litepath.slice(0,11)+"_pouchliteversion_one"
       this.#config = new Liteq({dpath: join(this.#path,".pouchlite"),dbname:"lite-config"})   
       this.paths={passedpath:this.#path,litepath:this.#litepath}
      } 
    get path(){  
        return {path:this.#path,litepath:this.#litepath}
    }
    //methods
    useDb(db=""){ 
       if(!db || typeof db !== "string" || db.length ===0){
        throw new Error("pouchlite: db required at useDb,not none string or empty")
       } 
       //check db
       let dbpath = join(this.#litepath,db);  
        if(!fs.existsSync(dbpath)){
         return new Db(db,dbpath,this.#litepath,false)
        }else{ 
          return new Db(db,dbpath,this.#litepath,true)
        }  
    }
    removeDb(db="",cb){
      if(!db || typeof db !== "string" || db.length ===0 && !cb || typeof cb !== "function"){
        throw new Error("pouchlite: db and cb required at removeDb,not none string or empty")
       } 
      
       let dbpath = join(this.#litepath,db);
        if(fs.existsSync(dbpath)){
           this.#config.remove(db).then(async (res)=>{
              if(res){
                   try{
                     fs.rmSync(dbpath,{recursive:true,force:true})
                     return cb({
                      iserror:false,
                      msg:"success",
                      code:200,
                      db
                     })
                   }catch(err){
                          if(err){
                            return cb({
                              iserror:true,
                              msg:"error occured",
                              code:400,
                              db:null
                            })
                          }
                   }
                   return
              }//
           
              
           })
        }else{
          return cb({
            iserror:true,
            msg:"not exists",
            code:404,
            db:null
          })
        }

    }
    change(cb){ 
       if(cb && typeof cb === "function"){
         this.#config.change(cb)
       }else{
        throw new Error("pouchlite: cb function required")
       }
    }
} 