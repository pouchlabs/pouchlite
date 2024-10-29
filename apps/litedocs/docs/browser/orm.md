# orm
interact with documents the right way quick and fast,
query your data like a boss 😑.
always remember what is your schema coz non gets inside without passing the schema for validation

all orm methods are :
* put - creates a single document to the collection
* putMany - creates many documents at once 
* get  - gets a single document
* getMany - gets Many documents in one batch limit 30
* update - updates a single document
* updateMany - updates Many documets in batch limit 30
* getAttachments - gets document attachments
* putAttachments - puts document attachments

## put
put document to collection
when no id is provided will be autogenerated,
when id is provided must be unique
```js
//put single
comments.put({id:"john_comment1",data:{title:"my first comment",body:"my comment body ",author:"john"},ttl:85000}) // ttl is optional,if passed must be a number greater than 2000

//put many limited to 30
let coms = [
    {title:"my first comment",body:"my comment body ",author:"john",id:"com1"},
    {title:"my second comment",body:"my second comment body ",author:"john",id:"com2"},
    {title:"my third comment",body:"my third comment body ",author:"john"id:"com3"}
    
]//optional id 
comments.putMany({data:coms}) //can pass optional ttl

```
## get
get document from collection
```js
//single
comments.get("com1") //id required

//get many
comments.getMany(["com1","com2","com3"]) //gets many docs in limit of 30
 
 //get many randomized
 comments.getMany()
```
## update
updates a document
```js
//single
comments.update({id:"com1",data:{body:"updated body comment"}})
//update many
comments.updateMany([{id:"com2",data:{body:"updated body comment"}},{id:"com1",data:{body:"updated body2 comment"}}]) //30 limit
```
## attachments
gets and puts document attachments
```js
//get attachments for document

 comments.getAttachments({id:"com1",attachmentid:"hhhhhg_jj"})

 //put attachments
 comments.putAttachments({id:"com1",attachment:"http://www.example.com/path/to/lenna.jpg",type:})
 //attachment can either be buffer, image url,base64-encoded format, or as a Blob.
```

