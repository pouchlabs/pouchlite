
import {exist,createFolder } from '../utils/filesystem.js';
import { liteconf } from './config.js';
import db ,{createDb,removeDb} from './db.js';


function Pouchlite(){
   let lite = {};
   lite.init = function (){
      exist(".pouchlite",(r)=>{
         let {iserror,exists} = r;
         if(iserror){
             return
             ;}
          if(exists){
           //project exists 
           return {
             iserror:true,
             msg:'pouchlite exists',
             lite:null
           }
          }
          //proceed
       //create lite folder if pass
         
         createFolder('.pouchlite',(r)=>{
              if(r.iserror){
                 return
              }
          
          }) 
     
       })  
    
       return {
         useDb:db,
         createDb,
         removeDb,
         info:async function(){
           return liteconf.data
         }
       }
   }
 
 return lite
} 

export default Pouchlite;