import { Liteq } from "./index.js"
const usersdb = new Liteq({dpath:"/tmp",dbname:"users"})
let fn = ()=>{

}

let t = await usersdb.set("test",{_id:"anto",users:[
    { id: 1, name: 'antombm' },
    { id: 2, age: 30, num: 60 },
    { id: 1, name: 'anto',age:50 },
    { id: 'm', name: 'antony' },
    { id: 3, age: 30, num: ["hi","hi",{id:"hv"}],f:fn },
  ]}) 






//doc.set("users",{users:[{id:1,name:"anto"}]})
let doc = await usersdb.get("test")
doc.users.forEach(u=>console.log(u.num))

