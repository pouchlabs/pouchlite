import { Liteq } from "./index.js"
const usersdb = new Liteq({dpath:"/tmp",dbname:"users"})


let t = await usersdb.set("test",{_id:"anto",users:[
    { id: 1, name: 'antomym' },
    { id: 'antony', age: 30, num: 60 },
    { id: 'm', name: 'antony' },
    { id: 'antony', age: 30, num: 60 },
  ]}) 



 let img = await usersdb.attachments.image.getAll("test") 
//let imgp= await usersdb.attachments.image.put("test","https://pouchlite.top/logo.png")
console.log(img) 

let doc = await usersdb.get("test")
//doc.set("users",{id:"map"})
console.log(doc) 

