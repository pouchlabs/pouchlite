import fs from "fs";
import { parse,join } from "path";
import { checktype,createFolder,genUuid } from "./utils.js";
import {Liteq} from "@pouchlab/liteq";
import { currentDb } from "./db.js";
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
       let found = null
       this.#config.get(db).then(d=>{
        found=d
       })
       if(found){
          return currentDb(found,this.#config)
       }
       //create new db
       let newdb = {
        id:genUuid(),
        name:db,
        path:join(this.#litepath,db),
        cols:[],
        cols_count:0,
        created_at:Date.now(),
       }
       if(!fs.existsSync(newdb.path)){
        this.#config.set(db,newdb)
        fs.mkdirSync(newdb.path,true)
      }
       return currentDb(newdb,this.#config)
    }
    info(){

    }
    change(cb){ 
       if(cb && typeof cb === "function"){
         this.#config.change(cb)
       }else{
        throw new Error("pouchlite: cb function required")
       }
    }
}