import {encode,decode} from '@msgpack/msgpack';
import { readFile,writeFile,unlink } from 'node:fs';

async function getMany(conf,ids,cb){
  
  ids.forEach(id => {
    let found = conf.data.docs.filter(da => da.id === id || da.id === id.id)
    if(found.length > 0){
      found.forEach(d=>{
        readFile(d.path,(err,data)=>{
              if(err){
                return cb({
                  iserror:true,
                  msg:'error occured',
                  error:err,
                  doc:null
                })
              }//no err
              return cb({
                iserror:false,
                msg:'success',
                error:null,
                doc:decode(data)
              })
        })
      })
      return
    }

  });

 
}

   
async function getSingle(conf,id,cb){
  let found = conf.data.docs.find(data => data.id === id)
   if(found){
    
       readFile(found.path,(err,data)=>{
        if(err){
          return  cb({
            iserror:true,
            msg:'error occured',
            error:err,
            doc:null
          })
        }
        //data found
        return cb({
          iserror:false,
          msg:'success',
          error:null,
          doc:decode(data)
        })
      });
  
    
    return
   }
   return cb({
    iserror:true,
    msg:'not found',
    error:null,
    doc:null
   })
}

async function saveUser(conf,user,doc,file,cb){
     //save for user
     writeFile(file,encode(doc),(err)=>{
      if(err){
          if(cb && typeof cb === 'function'){
              return cb({
                iserror:true,
                msg:'failed to save',
                error:err,
                doc:null
              }) 
            }
      }
      conf.data.docs.push({id:doc._id,createdAt:Date.now(),updatedAt:Date.now(),path:file,userid:user})
      conf.data.count = conf.data.count+1  
    conf.write()
     return cb({
      iserror:false,
      msg:'success',
      error:null,
      doc
     })
     })
}

async function saveAdm(conf,doc,file,cb){
        //save for adm
        writeFile(file,encode(doc),(err)=>{
          if(err){
              
              if(cb && typeof cb === 'function'){
                  return cb({
                    iserror:true,
                    msg:'failed to save',
                    error:err,
                    doc:null
                  })
                }
          }
          conf.data.docs.push({id:doc._id,createdAt:Date.now(),updatedAt:Date.now(),path:file,isadm:true})

          conf.data.count = conf.data.count+1  
        conf.write()
        if(cb && typeof cb === 'function'){
        return cb({
          iserror:false,
          msg:'success',
          error:null,
          doc
        })
      }
      })
  


}

async function updateOne(conf,merged,data,file,cb){
  unlink(file.path,(err)=>{ 
    if(err){
      return cb({
        iserror:true,
        msg:'error occured',
        error:err,
        doc:null
      })
    }
    writeFile(file.path,encode(merged),(err)=>{
      if(err){
        return{
          iserror:true,
          msg:'failed to update',
          error:err,
          doc:null
        }
      }

      let filtered = conf.data.docs.filter(docss => docss.id != file.id)
        file.updatedAt =Date.now()
        filtered.push(file)
      conf.write()
      return cb({
        iserror:false,
        msg:'success',
        error:null,
        doc:merged
      })
    })


  }) 
}

export {
    getMany,
    getSingle,
    saveUser,
    saveAdm,
    updateOne
}