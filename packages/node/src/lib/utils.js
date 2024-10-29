 import fs from "fs";
import {nanoid} from "nanoid"
 export var checktype = (function(global) {
    var cache = {}; 
    return function(obj) {
        var key;
        return obj === null ? 'null' // null
            : obj === global ? 'global' // window in browser or global in nodejs
            : (key = typeof obj) !== 'object' ? key // basic: string, boolean, number, undefined, function
            : obj.nodeType ? 'object' // DOM element
            : cache[key = ({}).toString.call(obj)] // cached. date, regexp, error, object, array, math
            || (cache[key] = key.slice(8, -1).toLowerCase()); // get XXXX from [object XXXX], and cache it
    };
  }(this));
  
  
  export function bytesForHuman(bytes, decimals = 2) {
    let units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB','EB', 'ZB', 'YB']
    let i = 0
    for (i; bytes > 1024; i++) {
        bytes /= 1024;
    }
    return parseFloat(bytes.toFixed(decimals)) + ' ' + units[i]
  }

  export function createFolder(path,cb){
    if(!fs.existsSync(path)){
      fs.mkdirSync(path,true)
      cb.call("success")
    }else{
      cb.call("exists")
    }
  }
  export function genUuid(n=16){
    if(n && typeof n === "number" && n >= 16){
        return nanoid(n)
      }
      throw new Error("liteq: genUuid requires number greater than 16 === 16")
    
  }
  export function removeListDuplicate(list){
      return list.filter((val,idx)=>list.indexOf(val) === idx)
  }
  
