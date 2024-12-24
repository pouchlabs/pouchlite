import {Jimp} from "jimp";
import {nanoid} from "nanoid";
import { encode,decode } from "msgpack-lite";

export async function getImage(docid,id,zip,lite){
    try {
          //init attachments
          if(!zip.getEntry("attachments")){
            //create empty
            zip.addFile("attachments",encode([]))
            zip.writeZip()
         }
        const doc = await lite.get(docid);
        if(!doc){
            return{
                iserror:true,
                msg:"invalid document",
                image:null,
                error:null
            }
        }
        let attachments = decode(zip.getEntry("attachments").getData());

        let attachment = attachments.find(file=>file.id === id);
        if(!attachment){
            return{
                iserror:true,
                msg:"image not found",
                image:null,
                error:null
            }
        }
          //found
          let ext = attachment.id+`.${attachment.mime.split("/")[1].trim()}`
          //read
        let imgentry = await zip.getEntry(ext);
        const img = await Jimp.read(imgentry.getData());
        img.meta=attachment
        return{
            iserror:false,
            msg:"success",
            image:img,
            error:null
        }
    } catch (error) {
        return {
            iserror:true,
            msg:"error occured",
            image:null,
            error:error
           }
    }
   
}

export async function getAllImages(docid,zip,lite){
     try{
          //init attachments
          if(!zip.getEntry("attachments")){
            //create empty
            zip.addFile("attachments",encode([]))
            zip.writeZip()
         }
       
        let attachments = decode(zip.getEntry("attachments").getData());

        let attachment = attachments.filter(file=>file.docid === docid);
        if(!attachment){
            return{
                iserror:true,
                msg:"image not found",
                image:null,
                error:null
            }
        }
        //loop
        let promise = []
        for(let att of attachment){
                //found
          let ext = att.id+`.${att.mime.split("/")[1].trim()}`
          //read
        let imgentry = zip.getEntry(ext);
        const img = await Jimp.read(imgentry.getData());
        img.meta=att
     
           promise.push({
                iserror:false,
                msg:"success",
                image:img,
                error:null
            })

        }
        return promise
        }catch(error){
        return{
            iserror:true,
            msg:"error occured",
            image:null,
            error:error
           }}
}

export async function putImage(id,zip,image,lite){
    try {
        //init attachments
        if(!zip.getEntry("attachments")){
            //create empty
            zip.addFile("attachments",encode([]))
            zip.writeZip()
         }
        const img = await Jimp.read(image);
        let newimg = {
            id:nanoid(16), 
            type:"image",
            mime:img.mime,
        }
        const doc = await lite.get(id);
        if(!doc){
            return{
                iserror:true,
                msg:"invalid document",
                image:null,
                error:null
            }
        }
        newimg.docid=doc._id;
          let attachments = decode(zip.getEntry("attachments").getData())
          attachments.push(newimg)
             //save
            let ext = newimg.id+`.${newimg.mime.split("/")[1].trim()}`
           zip.addFile(ext,await img.getBuffer(newimg.mime))
           //update
           zip.updateFile("attachments",encode(attachments))
           zip.writeZip()
         img.meta=newimg
        return {
            iserror:false,
            msg:"success", 
            image:img,
            error:null
        }
    } catch (error) {
       return {
        iserror:true,
        msg:"error occured",
        image:null,
        error:error
       }
    }
  
}
export async function removeImage(docid,id,zip,lite){
    try {
          //init attachments
          if(!zip.getEntry("attachments")){
            //create empty
            zip.addFile("attachments",encode([]))
            zip.writeZip()
         }
        const doc = await lite.get(docid);
        if(!doc){
            return{
                iserror:true,
                msg:"invalid document",
                image:null,
                error:null
            }
        }
        let attachments = decode(zip.getEntry("attachments").getData())
        let attachment = attachments.find(d=>d.id === id);
        if(!attachment){
            return{
                iserror:true,
                msg:"image not found",
                image:null,
                error:null
            }
        }
          //found
          
          let filtered = attachments.filter(atm=>atm.id !== attachment.id);
          let ext = attachment.id+`.${attachment.mime.split("/")[1].trim()}`
          //read
        zip.deleteEntry(ext);
        //save and update
        zip.updateFile("attachments",encode(filtered));
        zip.writeZip()
        return{
            iserror:false,
            msg:"success",
            image:attachment,
            error:null
        }
    } catch (error) {
        return {
            iserror:true,
            msg:"error occured",
            image:null,
            error:error
           }
    }
   
}