import Pouchlite from "./lite.js";
import z from "zod"
let lite = new Pouchlite()//.init();
 let users = lite.useDb("users")

 let posts = users.use("posts");
posts.sync("ws://localhost:7090") 
//console.log(await posts.getMany(["hi2","hi"]))   
console.log(await posts.put({id:"hi5",data:{users:{name:"antonymt",age:20},isadm:true}}) )
   

export { 
    Pouchlite
}