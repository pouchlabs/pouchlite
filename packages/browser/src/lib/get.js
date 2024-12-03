export async function get_single(id, current, local) {
  try {
    return JSON.parse(await local.getItem(id));
  } catch (error) {
    return null;
  }
}
export async function get_many(ids, current, local) {
  const docs = [];
  for (const id of ids) {
    const doc = await local.getItem(id);
    if (doc) {
      docs.push(JSON.parse(doc));
    }
  }
  return docs;
}
