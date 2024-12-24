import { lite } from "$lib/server/db";
const usersdb = lite.useDb("users");
const posts = await usersdb.use("posts")
console.log(posts)