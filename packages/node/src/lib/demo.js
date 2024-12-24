import Pouchlite from "./lite.js";

//testing
const lite = new Pouchlite();
const usersdb = lite.useDb("users");
const posts = await usersdb.use("posts");
let t = await posts.put({id:"test",data:{name:"anto"}})
//console.log(await posts.attachments.image.put("test","https://pouchlite.top/logo.png"))
 let imgs = await posts.attachments.image.getAll("test")
 console.log(posts.getKeys())