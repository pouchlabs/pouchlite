# database
all database methods are :
* useDb - uses already initialised db or creates a new one if not exist.
* removeDb - removes completely the database plus its collections and data
* change - all db changes
* info - information about db

## create db and use
create and use a database
```js
const usersdb = lite.useDb("users") //dbname,returns db methods
 console.log(usersdb)
```
## remove db
removes db completely
```js
 lite.removeDb("users",(removed)=>{
   console.log(removed)
})
```
## info about  db
removes db completely
```js
console.log(await usersdb.info()) //returns promise
```
