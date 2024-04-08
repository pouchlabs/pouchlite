
import {exist,createFolder } from '../utils/filesystem.js';
import { liteconf } from './config.js';


//function check if lite is in current project
function checkifLite(){
    console.log(liteconf.data.litepath)
  exist(".pouchlite",(r)=>{
    let {iserror,exists,msg,error} = r;
    if(iserror){
        return
        ;}

  }) 
}
async function Pouchlite(){
  checkifLite()
} 

let lite = await Pouchlite();

console.log(lite)

export default Pouchlite;