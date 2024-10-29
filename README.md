![logo](https://fasteejs.top/icon.png)
# pouchlite
# Next Gen Blazingly fast js storage engine

  pouchlite is a document and files storage engine
   # who can use 
  any one creating offline first apps or realtime app

  ## Features 
  we provide both browser,node and sync server

  * offline first - easy to implement offline first capabilities
  * fast -blazing fast writes and reads
  * built -in orm -interact with your data like boss 🔥
  * reduced file size - small db size from ground up
  * encryption - securely store documents
  * sync - sync data accross pouchlite instances
  * ttl -  expire documents
  * collections -store documents in collections

# packages included
 * lite-node - backend storage engine
 * lite-browser -browser storage engine
 * liteq -small mighty single db engine
 * lite-server - self-hosted sync server

# install
  ### lite-node
  provided as `@pouchlab/lite-node`
  ```bash
   npm i --save @pouchlab/lite-node
  ```
  ```js
   import {Pouchlite} from "@pouchlab/lite-node";
    const lite = new Pouchlite({path:"./"}) 
  //provide valid path to file or leave blank for default
  console.log(lite)
  ```
  [docs](https://pouchlite.top)
 ### lite-browser
  provided as `@pouchlab/lite-browser`
  ```bash
   npm i --save @pouchlab/lite-browser
  ```
```js
 import {Pouchlite} from "@pouchlab/lite-browser";
```
  ```js
    const usersdb = new Pouchlite("users") 
  console.log(usersdb)
  ```
  [docs](https://pouchlite.top)
 ### liteq
  provided as `@pouchlab/liteq`
  ```bash
   npm i --save @pouchlab/liteq
  ```
```js
 import {Liteq} from "@pouchlab/liteq";
```
  ```js
const usersdb = liteq({dpath:"/tmp",dbname:"users"}) //pass valid folder path and db name
  console.log(usersdb)
  ```
  [docs](https://pouchlite.top)
  ### lite-server
  this sync server is self-hosted
  check [lite-server](https://liteserver.pouchlabs.xyz)

 # author
 made with love by [ajm](https://devfolio.top/ajm) founder pouchlabs

# support 
 support the author if you realy value my work.
 you can give star
 or by giving financial support that would realy motivate me to keep
 creating awesome stuff for fellow devs

