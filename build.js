#!/usr/bin/env node
import { readFile, writeFile} from "fs";
import { promisify } from "util";
import esbuild from "esbuild";
import chokidar from "chokidar";
import clear from "console-clear";
import cluster from "node:cluster"


const read = promisify(readFile);
const write = promisify(writeFile);



const watcher = chokidar.watch('lib', {
  persistent: true,
  ignored: '*.txt',
  ignoreInitial: false,
  followSymlinks: true,
  cwd: '.',
  disableGlobbing: false,
  usePolling: false,
  interval: 100,
  binaryInterval: 300,
  alwaysStat: false,
  depth: 99,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  },
  ignorePermissionErrors: false,
  atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
});



const esbuildCommon = {
   entryPoints:["./lib/bin/*","./lib/*"], 
    platform: "node",
  chunkNames: 'chunks/[name]-[hash]',
   splitting: true,
  // logLevel:"info", 
  target: "es2022",
  loader: {  '.css': 'copy', '.data': 'base64' , ".js": "jsx",".ttf":"base64", ".json": "copy", ".png": "file", ".jpeg": "file", ".jpg": "file", ".svg": "dataurl", ".woff": "file" },
  color: true,
  minify: true,
  sourcemap: true,
  mainFields : [ 'module' , 'main' ],
 // define,
  external: ["*.gif"]
};
async function build(){
  try{
  
   let chunks = esbuild.build({
         format:"esm",
         bundle:true,
         outdir:"cli",
          ...esbuildCommon,
        })
        console.log("..finished generating files")
       //await chunks.rebuild() 
  
  }catch(err) {
    console.error("ERROR", err.stack || err);
    process.exit(1);
};
}
build()




watcher.on('change', async function re(path,stats){
if (cluster.isMaster) {
  cluster.fork();

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });
} 
 if (cluster.isWorker) {
  try{ 
  if (stats) {
     clear(true)
     setTimeout(()=>{
  console.log("..rebuilding")
     },300)
   setTimeout(async function r(){
   let chunks = await esbuild.context({
         format:"esm",
         bundle:true,
         outdir:"cli",
         logLevel:"info", 
          ...esbuildCommon,
        })
      let result = await chunks.rebuild() 
      if(result){
        clear(true)
    console.log("finished rebuilding")
    await chunks.dispose()
    if(result.errors || result.warnings) {
      //console.log(result)
    }
     
     }
    
   },400)
     
  }
  }catch(err) {
    //console.error("ERROR", err.stack || err);
   // process.exit(1);

}

  }
    //r()
//};
});

process.on('uncaughtException', function (err) {       
     

    process.exit(1);
    //re()  
});





  
