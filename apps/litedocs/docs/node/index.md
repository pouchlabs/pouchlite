# usage
how to use lite-node,is a backend only storage engine
```js
 import {Pouchlite} from "@pouchlab/lite-node";
```
## init
initialize new instance
```js
  const lite = new Pouchlite({path:"./"}) 
  //provide valid path to file or leave blank for default
  console.log(lite)
```
## info
gets information about current lite
```js
 console.log(lite.info())
```