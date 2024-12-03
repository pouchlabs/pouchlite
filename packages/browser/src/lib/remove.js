export async function remove_single(id, local, current) {
  try {
    local.removeItem(id);
    return 'success';
  } catch (error) {
    return 'error occured';
  }
}
export async function remove_many(ids, local, current) {
  try {
    for (const key of ids) {
      local.removeItem(key);
      return 'success';
    }
  } catch (error) {
    return 'error occured';
  }
}
