import crypto from "node:crypto";
function getInit(){
    return crypto.randomBytes(16);
}
  export function encrypt(text,key) {
    let iv = getInit()
    let cipher = crypto.createCipheriv('aes256', Buffer.from(key),iv);
    let encryptedData = cipher.update(text, "utf-8", "hex");
      encryptedData += cipher.final("hex");
    return { iv: iv.toString('hex'),
     encryptedData,
     full:"".concat(iv.toString('hex'),encryptedData)};
  } 
export function decrypt(text,Iv,key){
  try {
    let iv = Buffer.from(Iv,"hex");
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes256', Buffer.from(key),iv);
    let decryptedData = decipher.update(encryptedText, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
     if(decryptedData){
      return decryptedData
     }
  } catch (error) {
     throw new Error("liteq: bad encrypted data provided,provide encrypted string")
  }

  }




  
