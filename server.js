import polka from 'polka';
import sirv from 'sirv';
import chokidar from  'chokidar';
import clear from 'console-clear';
import detectPort from 'detect-port';
import child from 'node:child_process';

const app = polka();
const port = process.env.PORT || 8093
Number(port)
const assets = sirv('static/docs', {
    maxAge: 31536000, // 1Y
    immutable: true
  });
async function start(){  

    app.use(assets) 





detectPort(port)
  .then(_port => {
    if (port == _port) {
      console.log(`port: ${port} was not occupied`);
    } else {
        //exit process
        //process.exit(0) 
      console.log(`port: ${port} was occupied, try port: ${_port}`);
    }
  })
  .catch(err => {
    console.log(err);
  });


    //listen
    app.listen(port,'127.0.0.1',(err)=>{
       if(err){
         
        console.log({
            iserror:true,
            msg:'error occured',
            error:err
        })
       }
       console.log(`[pouchlite]: server listening on: http:localhost:${port}`)
    })
}
start() 

//watch
let watcher = chokidar.watch('./static', {
    persistent: true,
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

  async function serverRestart(){
     app.server.close()
     process.on("exit", function () {
        child.spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached : true,
            stdio: "inherit"
        });
    });
    process.exit();
  }
  watcher.on('change',(path)=>{ 
    clear()
    serverRestart()
  })
