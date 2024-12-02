# usage
how to use lite-node,is a backend only storage engine
```js
 import {Pouchlite} from "@pouchlab/lite-node";
```

## methods
* useDb -create or use a database
* removeDb - removes database and all collections
* change - initialised lite changes

## init
initialize new instance
```js
  const lite = new Pouchlite({path:"./"}) 
  //provide valid path to file or leave blank for default
```
## change
```js
  lite.change((data)=>{
    console.log(data)
  })
```
