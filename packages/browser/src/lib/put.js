import deepmerge from "deepmerge";
export function put_single(id,data,local){
let newdata = data;
newdata.id = id;
newdata.createdAt =  Date.now();
newdata.updatedAt =  Date.now();
newdata._attachments = [];
//save
local.setItem(id,JSON.stringify(newdata))
data.id=id;
return data;
}

export async function update_single(id,data,local){
    try {
        let to_update = JSON.parse(await local.getItem(id));
        let merged = deepmerge(to_update,data);
       local.setItem(id,JSON.stringify(merged))
       return merged;
    } catch (error) {
        throw null
    }
}
