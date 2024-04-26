import polka from 'polka';
import sirv from 'sirv';

const app = polka()
const port = process.env.PORT || 8093
Number(port)
const assets = sirv('docs', {
    maxAge: 31536000, // 1Y
    immutable: true
  });
async function start(){  

    app.use(assets) 


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

