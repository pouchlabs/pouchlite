import { Pouchlite } from "./index.js";
import { object ,string} from "valibot";


let lite = Pouchlite().init();

let db = await lite.useDb('user'); 
let schema = object({name:string()})
 

let users = await  db.collection.use('posts',schema)    

let da ={names:'maanto0bbud'} 

users.update({id:'YQJdh5OFxjA0PhgxCbknz',data:da},(res)=>{
    console.log(res) 
})  

users.bulkRemove([{id:'scxZPh7hA1h4-gMCy4QZI'},'YQJdh5OFxjA0PhgxCbknz'],(res)=>{
    console.log(res) 
}) 


users.on('change',(da)=>{
    console.log("change",da)
})   





    