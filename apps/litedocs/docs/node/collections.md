# collections
all collections methods are :
* use - uses already initialised collection or creates a new one if not exist.
* removeCollection - removes completely the collection plus its documents
* info - returns collection information
* change - change listener for the collection

## create collection and use
create and use a collection,
a collection requires a  valid zod object schema

```js
const usersdb = lite.useDb("users") //dbname
let commentSchema = z.object({
    title:z.string(),
    body:z.string(),
    author:z.string()
})

 let comments = usersdb.use("comments") //returns the orm here
 console.log(comments)
```
## remove a collection
danger,its removes a collection completely from the db

```js
 console.log(usersdb.removeCollection("comments"))
 //returns 
 {
    iserror:false,
    msg:"success",
     col:col_name
}
```
## info
returns collection information
use to create realtime functionality
```js
 console.log(comments.info())
```
## change
a change listener for the collection
```js
 comments.change((data)=>{
    console.log(data)
 })
```
