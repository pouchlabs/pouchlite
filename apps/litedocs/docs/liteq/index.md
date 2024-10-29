# usage
liteq is a key,value document single database engine for js.
thats secure,compressed and can act as redis alternative to cache data
how to use liteq,is a backend only storage engine

`npm i --save @pouchlab/liteq`
```js
 import {Liteq} from "@pouchlab/liteq";
```
## inspiration
draws inspiration from lowdb
## init
initialize new instance
```js
  const usersdb = liteq({dpath:"/tmp",dbname:"users"}) //pass valid folder path and db name
  console.log(usersdb)
```
## manipulate data
returns {
  data,
  write,
  read
}

```js
 console.log(usersdb.data)
 usersdb.data.users.push({name:"john",is_adm:true,created_at:Date.now(),age:40})
 console.log(usersdb.data)
 //save to file system
 usersdb.write()
```