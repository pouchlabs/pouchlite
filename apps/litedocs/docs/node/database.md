# database
all database methods are :
* useDb - uses already initialised db or creates a new one if not exist.
* removeDb - removes completely the database plus its collections and data

## create db and use
create and use a database
```js
const usersdb = lite.useDb("users") //dbname
 console.log(usersdb)
```
## remove db
removes db completely
```js
lite.removeDb("users")
```
