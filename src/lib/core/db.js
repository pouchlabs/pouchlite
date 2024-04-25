import { liteconf } from "./config.js";
import {nanoid} from 'nanoid';
import {join} from 'node:path';
import {rm} from 'node:fs';
import Emitter from 'eventemitter3';
import size  from 'get-folder-size';
import { currentCol } from "./colection.js";


import { createFolder} from "../utils/filesystem.js";

let dbEmmitter = new Emitter()



//use created db returns db object
async function use(db){
  if(db && typeof db === 'string'){
    let opts = {};
   let found = liteconf.data.dbs.find(data => data.name === db)
     if(found){
      //db exists
      opts.name = found.name;
      opts.id = found.id;
      opts.collections = found.collections;
      opts.path = found.path;
      opts.createCollection =  async function (name){
       if(name && typeof name === 'string'){
        let found = liteconf.data.dbs.find(data => data.collections.find(col => col.name === name))
          
         
          if(found){
          //exists assume
          return {
            iserror:false,
            msg:'collection exists'
          }
          }
          //not found create
           let newcol = {
            name,
            id:nanoid(16),
            path:join(opts.path,name)

           }
            let currentdb = liteconf.data.dbs.find(data => data.name === opts.name)
           currentdb.collections.push(newcol)
             //create collection folder
             createFolder(newcol.path,(r)=>{
              if(r.iserror === false){
                liteconf.write()
              } 
             }) 
           

          return{
            iserror:false,
            msg:'success ',
            col:newcol
          } 

       }
       return {
        iserror:true,
        msg:'collection name required',

       }
      }
      opts.removeCollection = async function (name){
        if(name && typeof name === 'string'){
          let found = liteconf.data.dbs.find(data => data.collections.find(col => col.name === name))
          
         
          if(found){
            console.log(found)
          }
          return{
            iserror:true,
            msg:'collection not found'
          }


        }
        return {
         isserror:true,
         msg:'collection name required',
         
        }
      }
      opts.info = async function(){
         return {
          name:opts.name,
          id:opts.id,
          collections:opts.collections,
          path:opts.path,
          size: await size.loose(opts.path)
         }
      };
  
   //
      opts.collection= {
         use:async function(cname,schema){
          if(cname && typeof cname === 'string' && schema && typeof schema === typeof {} && schema._parse){
            let foundcol = opts.collections.find(data => data.name === cname)
            
            if(foundcol){
                 return await currentCol(foundcol,opts,schema);
             }

             return{
              isserror:true,
              msg:'collection not found'
             }
          }
          return{
            isserror:true,
            msg:'collection name required'
          }

         }
      } 

      
      
      return opts
     }
     return {
      iserror:true,
      msg:'db not exists',
      db:null
     }
   
  }
  return {
    iserror:true,
    msg:'db name required,<string>',
    db:null,
  }
}



async function createDb(db){
  if(!db){
    return {
      iserror:true,
      msg:'db name required',
      db:null,
    } 
  }
  if(db && typeof db === 'string'){
    let dbs = liteconf.data.dbs;
   
    let found = dbs.find(data=> data.name == db)
    
    if(found){ 
         //db exists

      return {
        iserror:true,
        msg:'db exists',
        db:null
      }
    }
    //not found create db
 
 createFolder(`.pouchlite/${db}`,(r)=>{
  if(r.iserror){
     return
  }  
  if(r.exists){
    return
  }

  dbs.push({id:nanoid(),name:db,time:Date.now(),path:join(liteconf.data.litepath,db),collections:[]})
 liteconf.write()
})
   return {
    iserror:false,
    msg:'success',
    db
   }
  } 

} 

//remove db settings,coletions,data
async function removeDb(db,cb){
  if(db && typeof db === 'string' && cb && typeof cb === 'function'){
    let dbs = liteconf.data.dbs;
    let found = dbs.find(data => data.name === db)
    if(found){
      //db exists remove
    dbEmmitter.emit('remove:db',{name:db,id:found.id})
      rm(found.path,{recursive:true,force:true},(err)=>{
        if(err){
          dbEmmitter.removeListener('remove:db',{err})
          return
        }
       let filtered = dbs.filter(data => data.name != db)
         liteconf.data.dbs=filtered
        liteconf.write()
        dbEmmitter.removeListener('remove:db',{msg:'success'})
        return cb({
          iserror:false,
          msg:'success'
        })
          
      })
    }else{
    return cb({
      iserror:true,
      msg:'db no exist'
    })
  }
  }
} 




export {
  dbEmmitter,
  createDb,
  removeDb,

}
export default use;