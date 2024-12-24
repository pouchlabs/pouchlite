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

  //unique method
  export function uniqueArr(arr){
   for(let i of arr){
    // checking if object
    if(checktype(i) === checktype({})){
      return  [...new Map(arr.map(item => [item.id, item])).values()]
    }else{
      return Array.from(new Set(this))
    }
  }
  }
  //loop merged
 export  function loopMerged(merged){
    let map_to_save = new Map();
    //loop keys
    for(let i in merged){
       let full_key_value = merged[i];
       //check for array
       if(checktype(full_key_value) === checktype([])){
          map_to_save.set(i,uniqueArr(full_key_value))
       }
       else{
         map_to_save.set(i,merged[i])
       }
    }
    return Object.fromEntries(map_to_save)
  }