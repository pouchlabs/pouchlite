# usage
liteq is a key,value document single database engine for js.
thats secure,compressed and can act as redis alternative to cache data
how to use liteq,is a backend only storage engine

`npm i --save @pouchlab/liteq`
```js
 import {Liteq} from "@pouchlab/liteq";
```

## init
initialize new instance
```js
  const usersdb = new Liteq({dpath:"/tmp",dbname:"users"}) //pass valid folder path and db name
  console.log(usersdb) //see all exposed methods
```
methods:
* get - gets data / returns promise
* set - sets data
* remove - removes data
* change - listen for changes
* clear - clear all data 

```js
//get
await usersdb.get("id") 

//set
await usersdb.set("hu",{msg:"hi"}) //id and object required and optional ttl

//remove
await usersdb.remove("hu")
//change
usersdb.change((data)=>{ //listen for changes
   console.log(data)
})
//clear
usersdb.clear((res)=>{
  console.log(res)
})

//helpers

usersdb.helpers.encrypt("hi") //requires text
usersdb.helpers.decrypt("aaajkkfhjkf") //requires encrypted text
usersdb.helpers.genUuid(18) //requires optional number length

```