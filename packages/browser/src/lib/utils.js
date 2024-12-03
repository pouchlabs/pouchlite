import { decode, decodeAsync } from '@msgpack/msgpack';

const checktype = ((global) => {
  const cache = {};
  return (obj) => {
    let key;
    return obj === null
      ? 'null' // null
      : obj === global
        ? 'global' // window in browser or global in nodejs
        : (key = typeof obj) !== 'object'
          ? key // basic: string, boolean, number, undefined, function
          : obj.nodeType
            ? 'object' // DOM element
            : cache[(key = {}.toString.call(obj))] || // cached. date, regexp, error, object, array, math
              (cache[key] = key.slice(8, -1).toLowerCase()); // get XXXX from [object XXXX], and cache it
  };
})(this);

async function decodeFromBlob(blob) {
  if (blob.stream) {
    //todo loop
    // Blob#stream(): ReadableStream<Uint8Array> (recommended)
    try {
      return await decodeAsync(blob.stream());
    } catch (error) {
      return;
    }
  } else if (blob.arrayBuffer) {
    try {
      return decode(await blob.arrayBuffer());
    } catch (error) {
      return;
    }
  } else {
    try {
      return decode(blob);
    } catch (error) {
      return;
    }
  }
}
export { decodeFromBlob, checktype };
