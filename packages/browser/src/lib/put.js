import deepmerge from 'deepmerge';
import { loopMerged } from './utils';
export function put_single(id, data, local) {
  const newdata = data;
  newdata.id = id;
  newdata.createdAt = Date.now();
  newdata.updatedAt = Date.now();
  //save
  local.setItem(id, JSON.stringify(newdata));
  data.id = id;
  return data;
}

export async function update_single(id, data, local) {
  try {
    const to_update = JSON.parse(await local.getItem(id));
    to_update.updatedAt = Date.now();
    //checks
    if(data.id){
      data.id=id
    }
    const merged = deepmerge(to_update,data);
    let final = await local.setItem(id, JSON.stringify(loopMerged(merged)))
    return JSON.parse(final);
  } catch (error) {
    throw null;
  }
}
