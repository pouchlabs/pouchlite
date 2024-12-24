import Pouchlite from "./lite.js";

//testing
const lite = new Pouchlite();
const usersdb = lite.useDb("users");
const posts = await usersdb.use("posts");
posts.attachments.image.get()
export default Pouchlite; 
export { 
    Pouchlite
}