import {join} from 'path';
import { JSONFilePreset } from 'lowdb/node';
import Emmiter from 'eventemitter3';
import {decode} from "@msgpack/msgpack";
import { readFile, unlink} from 'fs';
import { nanoid } from 'nanoid';
import { getMany,getSingle,saveUser,saveAdm, updateOne } from '../utils/index.js';
import merge from 'deepmerge';

const colEmmiter = new Emmiter();
   



async function verifySchema(s,obj){
  let  passed = s._parse(obj)
   if(Buffer.from(JSON.stringify(passed.output)).byteLength > 2){ 
  
    return {
        iserror:false,
        issues:passed.issues,
        output:passed.output
    }
   }else{
    return {
        iserror:true,
        issues:passed.issues,
        output:null
    }
   }
}


//returns current collection
export async function currentCol(found,opts,schema){
    let colboj = found;
    colboj.schema = schema;
    colboj.meta={
        name:'meta.json',
        path:join(found.path,'meta.json'),
        conf:await JSONFilePreset(join(found.path,'meta.json'),{docs:[],count:0})
    }
     colboj.db={
        path:opts.path,
        name:opts.name,
        id:opts.id
     }
     colboj.put= async function(obj,cb){
        if(obj && typeof obj === typeof {}){
            //
            let user = obj.userid || '';
            let data = obj.data || null;
            if(data && typeof data === typeof {}){
            let {output} = await verifySchema(colboj.schema,data)
             if(output){
              let docid = nanoid(16);
              let newdoc = output;
              newdoc._id = docid;
              newdoc._attachments = [];
              let file = join(found.path,`${docid}.lite`);
              
              let conf = found.meta.conf;
             
                
            if(user){
                //save for user
                saveUser(conf,user,newdoc,file,(res)=>{
                  colboj.emit('change',res)
                  return cb(res)   
                })
           
            }else{
                //save for adm
                saveAdm(conf,newdoc,file,(res)=>{
                  colboj.emit('change',res)
                  return cb(res) 
                })
                }
                
            
             }
           }else{
            if(cb && typeof cb === 'function'){
            return cb({
                iserror:true,
                msg:'data  is required',
                error:null,
                doc:null

            })
        }
           }
          

        }else{
           if(cb && typeof cb === 'function'){
          return cb({
            iserror:true,
            msg:'valid object required',
            error:null,
            doc:null
          })
        }
        }
     }
     colboj.bulkPut=async function(opts,cb){
         if(opts && typeof opts === typeof {} && cb && typeof cb === 'function'){
           let user = opts.userid || '';
           let data = opts.data || [];
           let conf = colboj.meta.conf;
           if(user){
              if(data && data.length > 0) {
                data.forEach(async(val)=>{
                  //verify schema
             let {output} = await verifySchema(colboj.schema,val)
             
             if(output){
              
             
               let id = nanoid()
               let newdoc = val;
                 newdoc._id = id;
                 newdoc._attachments=[]
               
               let file = join(colboj.path,`${id}.lite`);
               saveUser(conf,user,newdoc,file,(res)=>{
                colboj.emit('change',res)
                return cb(res)   
               })
             }//sche
             })
           
              }
           }else{
            //not 
            if(data && data.length > 0) {
           
              data.forEach(async(val)=>{
                //verify schema
           let {output} = await verifySchema(colboj.schema,val)
           
           if(output){
            
           
             let id = nanoid()
             let newdoc = val;
               newdoc._id = id;
               newdoc._attachments=[]
             
             let file = join(colboj.path,`${id}.lite`);
             saveAdm(conf,newdoc,file,(res)=>{
              colboj.emit('change',res)
              return cb(res) 
             })
           }//sche
           })
         
            }
           }
           



         }
     }
     
    colboj.get = async function(opts,cb){
      if(opts && typeof opts === typeof {} && cb && typeof cb === 'function'){
        let ids = opts.id
        let conf = colboj.meta.conf;
          //check type of id
          if(ids && typeof ids === 'string' && ids.length > 0 ){
            //run single
             getSingle(conf,ids,(da)=>{
              return cb(da)
             })
             
          }//end single
          if(ids && typeof ids === typeof [] && ids.length > 0){
            //bulk get
           getMany(conf,ids,(da)=>{
            return cb(da)
           })
          }

       
      }
    }
    colboj.update = async function(opts,cb){
       if(opts && typeof opts === typeof {} && cb && typeof cb === 'function'){
         let id = opts.id || '';
         let data =opts.data || null;
         let conf = colboj.meta.conf;
        if(id && data && typeof data === typeof {}){
          //verify schema
          let {output} = await verifySchema(colboj.schema,data);
        
          if(output){
          let found = conf.data.docs.find(dat => dat.id === id)
          if(found){
            getSingle(conf,found.id,(res)=>{
              let doctoupdate = res.doc;

              if(doctoupdate){
                let merged = merge(doctoupdate,data) 
                updateOne(conf,merged,data,found,(re)=>{
                  colboj.emit('change',re)
                   return cb(re) 
                })
              }
           
    

            })

          
            return
          }//not 
            return cb({
              iserror:true,
              msg:'not found',
              error:null,
              doc:null
            }) 

          }
        }
       }
    }


    colboj.getAllByuser= async function(id,cb){
      if(id && typeof id === 'string' && id.length > 0 && cb && typeof cb === 'function' ){
    
      let conf = colboj.meta.conf;

        let founddatabyuser = conf.data.docs.filter(data => data.userid === id);
        
        if(founddatabyuser.length > 0){
          //user data found
            
            //loop
            founddatabyuser.forEach((val,i)=>{
              readFile(val.path,(err,data)=>{
                if(err){
                  return cb({
                    iserror:true,
                    msg:'error occured',
                    error:err,
                    doc:[]
                  })
                }
                //no err
              
                return cb({
                  iserror:false,
                  msg:'success',
                  error:null,
                  doc:decode(data)
                }) 
              })
              
            })
          
    
          }else if(founddatabyuser.length == 0){
            return cb({
              iserror:false,
              msg:'not found',
              error:null,
              doc:null
             })
          }
       
    
       

      }
      
     

    }

    colboj.getOneByuser = async function(opts,cb){
      if(opts && typeof opts === typeof {} && cb && typeof cb === 'function'){
            let user = opts.userid || "";
            let id = opts.id || "";
            let conf = colboj.meta.conf;
            if(user && typeof user === 'string' && id && typeof id === 'string' ){
             //user and id  provided
             let founddata = conf.data.docs.find(da => da.userid == user && da.id == id)
             if(founddata){
               readFile(founddata.path,(err,data)=>{
                  if(err){
                    return cb({
                      iserror:true,
                      msg:'error occured',
                      error:err,
                      doc:null
                    })
                  }
                  //no er
                  return cb({
                    iserror:false,
                    msg:'success',
                    error:null,
                    doc:decode(data)
                  })
               })
               return
             }//not found
               
            return cb({
              iserror:false,
              msg:'not found',
              error:null,
              doc:null
            })
            }//is not provided
            return cb({
              iserror:true,
              msg:'userid & id required',
              error:null,
              doc:null
            })
      }
    }
//remove doc
colboj.remove= async function(id,cb){
  if(id && typeof id === 'string' && id.length > 0 && cb && typeof cb === 'function'){
    let conf = colboj.meta.conf;

    let found = conf.data.docs.find(da => da.id === id);

    if(found){
      //getit
          //all done
          conf.data.docs = conf.data.docs.filter( da => da.id != found.id)
          //update
          conf.data.count = conf.data.docs.length - 1
          
          
        conf.write()  
     
   
      readFile(found.path,(err,data)=>{
          if(err){
            return cb({
              iserror:true,
              msg:'error occured',
              error:err,
            })

          }
          
          //
          unlink(found.path,(err)=>{
            if(err){
              return cb({
                iserror:true,
                msg:'error occured',
                error:err
              })
            }//
            //loop through attachments remove
            let decodeddata = decode(data);

            decodeddata._attachments.forEach(val=>{
              //remove attach
              if(val.path){
              unlink(val.path,(err)=>{
                if(err){
                  return cb({
                    iserror:true,
                    msg:'error occured',
                    error:err
                  })
                }
             
                return cb({
                  iserror:false,
                  msg:'success removed attachments',
                
                })
              })
              
            }//end attachment
            
            })
            
          })
      })
      //
      return cb({
        iserror:false,
        msg:'success removed doc',
        id
       })
      //
     
    }
  }
}

colboj.bulkRemove=async function(ids,cb){
  if(ids && typeof ids === typeof [] && ids.length > 0 && cb && typeof cb === 'function'){
   
    ids.forEach(val =>{
        if(val.id){
          colboj.remove(val,(re)=>{
            return cb(re)
          }) 
            

         return
        }else{

              colboj.remove(val,(re)=>{
                return cb(re)
              }) 
                
        //
      }

    }) 
  } 

}
 //events
    colboj.emit= function(ev,obj){
        colEmmiter.emit(ev,obj)    
    }
    colboj.on = function(ev,cb){
        colEmmiter.on(ev,(data)=>{
            return cb(data)
        })
    }
  
//todo add attachments methods


 return colboj
}