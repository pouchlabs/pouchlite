import fs from 'node:fs';
import {join} from "node:path";

async function exist(file,cb){
    try{
        fs.exists(join(process.cwd(),file),(files)=>{
        if(cb && typeof cb === 'function'){
            return cb({
                iserror:false,
                exists:files,
                msg:'success'
            })
        }
        }) 
    }catch(err){
        if(err){
            if(cb && typeof cb === 'function'){
                return cb({
                    iserror:true,
                    msg:'error occured',
                    error:err
                })
            }
        }
    }


} 

//create folder in current working dir
async function createFolder(file,cb){
  if(file && cb && typeof file === "string" && typeof cb ==='function'){

    exist(file,(r)=>{
     let {iserror,exists,error} = r

       if(iserror){
       throw error;
       }
    //check if exists
      if(exists){
         return cb({
            iserror:false,
            exists,
            file
        })

      }else{
        //not existing create folder
        try{
           
            fs.mkdir(file,()=>{
               return cb({
                iserror:false,
                file,
                msg:'success'
               })
            })
        }catch(err){
           return cb({
            iserror:true,
            file:null,
            error:err
           })
        }
      
      }
       
    })
    
  }
}
//remove folder in current working dir
async function removeFolder(file,cb){
    if(file && cb && typeof file === 'string' && typeof cb === "function"){
       
        fs.rm(join(process.cwd(),file),{recursive:true,force:true},(err)=>{
            if(err){
                return cb({iserror:true,error:err,file:null,msg:'error occured'})
            }
            //success removed
            return cb({
                iserror:false,
                error:null,
                file,
                msg:'success'
            })
          
        })
    }

}




export {
    exist,
    createFolder,
    removeFolder
}
