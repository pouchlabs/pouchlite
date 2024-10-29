import { currentCol } from "./collection.js";

export function currentDb(db,lite_config){
 let meta = db || db.data;

return {
 meta,
 use:(col_name="")=>{
    if(!col_name || typeof col_name !== "string" || col_name.length ===0){
        throw new Error("pouchlite: collection name required at use,not none string or empty")
       }
  return currentCol(col_name,meta,lite_config)
 }, 
 removeCollection:()=>{

 },
 info(){

 }
}
}