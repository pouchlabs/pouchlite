import Pouchlite from "./lite.js";
import { z } from "zod";

// creating a schema for strings
const mySchema = z.object({
  name:z.string(),
  age:z.number()
});


const lite = new Pouchlite({path:"./"}) 
  //provide valid path to file or leave blank for default
 const usersdb = lite.useDb("users") //dbname
 const posts = usersdb.use("posts");  
console.log(lite)
 //posts.defineSchema(mySchema)  

//usersdb.removeCollection("posts")  
//todo remove function

export default Pouchlite;
export { 
    Pouchlite
}