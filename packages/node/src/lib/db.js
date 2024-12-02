import { currentCol } from "./collection.js";
import {join } from "path";
import {Liteq} from "@pouchlab/liteq";
import {genUuid } from "./utils.js";
import fs from "fs";

export class Db{
  #db
  constructor(db,dpath,litepath,exists){
   this.lite_config = new Liteq({dpath: join(litepath,"."),dbname:"lite-config"});
   this.db = db;
   this.#db = db
   this.dpath = dpath;
   this.litepath = litepath
   if(!exists){  
    //create new db
      fs.mkdir(join(this.litepath,db),true,async (err,data)=>{
          if(err){
            throw new Error("pouchlite: failed to create new db")
          }
        await this.lite_config.set(db,{
            name:db,
            id:genUuid(),
            path:dpath,
            cols:[],
            cols_count:0,
          })
      });     
   
   }
  }
  async info(){
     return  await this.lite_config.get(this.#db).then(d=>{
    return d
   })
}
 async use(col_name=""){
    if(!col_name || typeof col_name !== "string" || col_name.length ===0){
        throw new Error("pouchlite: collection name required at use,not none string or empty")
       }
  return currentCol(col_name,await this.info(),this.lite_config)
 }

 async removeCollection(col_name=""){
   // todo remove
   if(!col_name || typeof col_name !== "string" || col_name.length ===0){
    throw new Error("pouchlite: collection name required at use,not none string or empty")
   }

   let found = await this.lite_config.get(this.db);
   if(found){
    let filtered = found.cols.filter(c=>c.name !== col_name);
    let col_to_remove= found.cols.find(c=>c.name === col_name)
   
    //remove
     try{
      fs.rmSync(col_to_remove.path,{recursive:true,force:true})
    found.cols=filtered;
    found.cols_count = found.cols_count--;
     await this.lite_config.set(found.name,found)
       return{
         iserror:false,
         msg:"success",
         col:col_name
      }
    }catch(err){
       if(err){
         return{
           iserror:true,
           msg:"error occured",
           col:null
         }
        }
     }
 
   }else{
    return {
      iserror:false,
      msg:"not found",
      col:null
    }
   }
 }

}