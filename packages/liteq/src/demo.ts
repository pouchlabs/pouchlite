import { Liteq } from "./lite.ts";

const db = new Liteq();
//console.log(await db.remove("one")) 
db.set("one",{name:"abcdejkbrknm",ab:"ahmbkl"});
db.set("2",{name:"abcdejkbrknm",ab:"ahmbkfb"});
// db.onChange((d)=>{  
//     console.log(d,"change")
// })
//db.attachments.image.put("one","https://images.pexels.com/photos/33816607/pexels-photo-33816607.jpeg")
db.onRemoved((ev)=>{  
    console.log(ev,"re")
})  

await db.get("one",(ev)=>{
    console.log(ev,"ev")
})

