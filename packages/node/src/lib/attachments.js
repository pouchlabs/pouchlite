import { Jimp } from "jimp";

export async function getImage(id,opts){
    const image = await Jimp.read("static/favicon.png");
    console.log(image)
}
export async function putImage(img,opts){

}