import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// ../../node_modules/deepmerge/dist/cjs.js
var require_cjs = __commonJS((exports, module) => {
  var isMergeableObject = function isMergeableObject(value) {
    return isNonNullObject(value) && !isSpecial(value);
  };
  function isNonNullObject(value) {
    return !!value && typeof value === "object";
  }
  function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
  }
  var canUseSymbol = typeof Symbol === "function" && Symbol.for;
  var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
  function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE;
  }
  function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
  }
  function cloneUnlessOtherwiseSpecified(value, options) {
    return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
  }
  function defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function(element) {
      return cloneUnlessOtherwiseSpecified(element, options);
    });
  }
  function getMergeFunction(key, options) {
    if (!options.customMerge) {
      return deepmerge;
    }
    var customMerge = options.customMerge(key);
    return typeof customMerge === "function" ? customMerge : deepmerge;
  }
  function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
      return Object.propertyIsEnumerable.call(target, symbol);
    }) : [];
  }
  function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
  }
  function propertyIsOnObject(object, property) {
    try {
      return property in object;
    } catch (_) {
      return false;
    }
  }
  function propertyIsUnsafe(target, key) {
    return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
  }
  function mergeObject(target, source, options) {
    var destination = {};
    if (options.isMergeableObject(target)) {
      getKeys(target).forEach(function(key) {
        destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
      });
    }
    getKeys(source).forEach(function(key) {
      if (propertyIsUnsafe(target, key)) {
        return;
      }
      if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
        destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
      } else {
        destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
      }
    });
    return destination;
  }
  function deepmerge(target, source, options) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || isMergeableObject;
    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) {
      return cloneUnlessOtherwiseSpecified(source, options);
    } else if (sourceIsArray) {
      return options.arrayMerge(target, source, options);
    } else {
      return mergeObject(target, source, options);
    }
  }
  deepmerge.all = function deepmergeAll(array, options) {
    if (!Array.isArray(array)) {
      throw new Error("first argument should be an array");
    }
    return array.reduce(function(prev, next) {
      return deepmerge(prev, next, options);
    }, {});
  };
  var deepmerge_1 = deepmerge;
  module.exports = deepmerge_1;
});

// ../../node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS((exports, module) => {
  var has = Object.prototype.hasOwnProperty;
  var prefix = "~";
  function Events() {}
  if (Object.create) {
    Events.prototype = Object.create(null);
    if (!new Events().__proto__)
      prefix = false;
  }
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }
  function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt])
      emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn)
      emitter._events[evt].push(listener);
    else
      emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
  }
  function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0)
      emitter._events = new Events;
    else
      delete emitter._events[evt];
  }
  function EventEmitter() {
    this._events = new Events;
    this._eventsCount = 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0)
      return names;
    for (name in events = this._events) {
      if (has.call(events, name))
        names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
  };
  EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers)
      return [];
    if (handlers.fn)
      return [handlers.fn];
    for (var i = 0, l = handlers.length, ee = new Array(l);i < l; i++) {
      ee[i] = handlers[i].fn;
    }
    return ee;
  };
  EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners)
      return 0;
    if (listeners.fn)
      return 1;
    return listeners.length;
  };
  EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
      if (listeners.once)
        this.removeListener(event, listeners.fn, undefined, true);
      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1);i < len; i++) {
        args[i - 1] = arguments[i];
      }
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j;
      for (i = 0;i < length; i++) {
        if (listeners[i].once)
          this.removeListener(event, listeners[i].fn, undefined, true);
        switch (len) {
          case 1:
            listeners[i].fn.call(listeners[i].context);
            break;
          case 2:
            listeners[i].fn.call(listeners[i].context, a1);
            break;
          case 3:
            listeners[i].fn.call(listeners[i].context, a1, a2);
            break;
          case 4:
            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
            break;
          default:
            if (!args)
              for (j = 1, args = new Array(len - 1);j < len; j++) {
                args[j - 1] = arguments[j];
              }
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
    return true;
  };
  EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
  };
  EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
  };
  EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        clearEvent(this, evt);
      }
    } else {
      for (var i = 0, events = [], length = listeners.length;i < length; i++) {
        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
          events.push(listeners[i]);
        }
      }
      if (events.length)
        this._events[evt] = events.length === 1 ? events[0] : events;
      else
        clearEvent(this, evt);
    }
    return this;
  };
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt])
        clearEvent(this, evt);
    } else {
      this._events = new Events;
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  EventEmitter.prefixed = prefix;
  EventEmitter.EventEmitter = EventEmitter;
  if (typeof module !== "undefined") {
    module.exports = EventEmitter;
  }
});

// src/lite.ts
var import_deepmerge = __toESM(require_cjs(), 1);
import { existsSync as existsSync2, mkdirSync as mkdirSync2, stat } from "node:fs";
import { join as join4 } from "node:path";
import Event from "@pouchlab/emitter";

// node_modules/nanoid/index.js
import { webcrypto as crypto } from "node:crypto";

// node_modules/nanoid/url-alphabet/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// node_modules/nanoid/index.js
var POOL_SIZE_MULTIPLIER = 128;
var pool;
var poolOffset;
function fillPool(bytes) {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    crypto.getRandomValues(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    crypto.getRandomValues(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
}
function nanoid(size = 21) {
  fillPool(size |= 0);
  let id = "";
  for (let i = poolOffset - size;i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63];
  }
  return id;
}

// src/utils.ts
import { writeFileSync, rmSync, createReadStream } from "node:fs";
import { join as join2 } from "node:path";
import { pipeline } from "node:stream";
import { UnpackrStream, PackrStream } from "msgpackr";
import Zlib from "node:zlib";

// ../../node_modules/steno/lib/index.js
import { rename, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
function getTempFilename(file) {
  const f = file instanceof URL ? fileURLToPath(file) : file.toString();
  return join(dirname(f), `.${basename(f)}.tmp`);
}
async function retryAsyncOperation(fn, maxRetries, delayMs) {
  for (let i = 0;i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
}

class Writer {
  #filename;
  #tempFilename;
  #locked = false;
  #prev = null;
  #next = null;
  #nextPromise = null;
  #nextData = null;
  #add(data) {
    this.#nextData = data;
    this.#nextPromise ||= new Promise((resolve, reject) => {
      this.#next = [resolve, reject];
    });
    return new Promise((resolve, reject) => {
      this.#nextPromise?.then(resolve).catch(reject);
    });
  }
  async#write(data) {
    this.#locked = true;
    try {
      await writeFile(this.#tempFilename, data, "utf-8");
      await retryAsyncOperation(async () => {
        await rename(this.#tempFilename, this.#filename);
      }, 10, 100);
      this.#prev?.[0]();
    } catch (err) {
      if (err instanceof Error) {
        this.#prev?.[1](err);
      }
      throw err;
    } finally {
      this.#locked = false;
      this.#prev = this.#next;
      this.#next = this.#nextPromise = null;
      if (this.#nextData !== null) {
        const nextData = this.#nextData;
        this.#nextData = null;
        await this.write(nextData);
      }
    }
  }
  constructor(filename) {
    this.#filename = filename;
    this.#tempFilename = getTempFilename(filename);
  }
  async write(data) {
    return this.#locked ? this.#add(data) : this.#write(data);
  }
}

// src/utils.ts
import { Pqueue } from "@pouchlab/worker-pool";
var Queue = new Pqueue;
async function createFile(path) {
  try {
    const file = await Bun.write(Bun.file(path), "") || writeFileSync(path, "");
    return file;
  } catch (_error) {
    return null;
  }
}
var checktype = ((global) => {
  const cache = {};
  return (obj) => {
    let key;
    return obj === null ? "null" : obj === global ? "global" : (key = typeof obj) !== "object" ? key : obj.nodeType ? "object" : cache[key = {}.toString.call(obj)] || (cache[key] = key.slice(8, -1).toLowerCase());
  };
})(null);
function bytesForHuman(bytes, decimals = 2) {
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  for (i;bytes > 1024; i++) {
    bytes /= 1024;
  }
  return `${Number.parseFloat(bytes.toFixed(decimals))} ${units[i]}`;
}
function uniqueDeepArr(arr) {
  const arrUniq = [...new Map(arr.slice().map((v) => [v.id, v])).values()];
  const map = new Map;
  const deeparr = [];
  for (const i in arrUniq) {
    for (const d in arrUniq[i]) {
      map.set(d, arrUniq[i][d]);
      if (checktype(map.get(d)) === checktype([])) {
        const unique = [];
        const obarr = [];
        const sarr = [];
        const narr = [];
        for (const val of map.get(d)) {
          if (checktype(val) === checktype({})) {
            obarr.push(val);
          }
          if (checktype(val) === "string") {
            sarr.push(val);
          }
          if (checktype(val) === "number") {
            narr.push(val);
          }
        }
        for (const f of uniqueDeepArr(obarr)) {
          unique.push(f);
        }
        for (const f of removeDuplicate(sarr)) {
          unique.push(f);
        }
        for (const f of removeDuplicate(narr)) {
          unique.push(f);
        }
        map.set(d, unique);
        deeparr.push(Object.fromEntries(map));
      } else {
        deeparr.push(Object.fromEntries(map));
      }
    }
  }
  return [...new Map(deeparr.slice().map((v) => [v.id, v])).values()];
}
function removeDuplicate(array) {
  return [...new Set(array.map((s) => JSON.stringify(s)))].map((s) => JSON.parse(s));
}
function uniqueArr(arr) {
  const unique = [];
  const obarr = [];
  const sarr = [];
  const narr = [];
  for (const val of arr) {
    if (checktype(val) === checktype({})) {
      obarr.push(val);
    }
    if (checktype(val) === "string") {
      sarr.push(val);
    }
    if (checktype(val) === "number") {
      narr.push(val);
    }
  }
  for (const f of uniqueDeepArr(obarr)) {
    unique.push(f);
  }
  for (const f of removeDuplicate(sarr)) {
    unique.push(f);
  }
  for (const f of removeDuplicate(narr)) {
    unique.push(f);
  }
  return unique;
}
function loopMerged(merged) {
  const map_to_save = new Map;
  for (const i in merged) {
    const full_key_value = merged[i];
    if (checktype(full_key_value) === checktype([])) {
      map_to_save.set(i, uniqueArr(full_key_value));
    } else {
      map_to_save.set(i, merged[i]);
    }
  }
  return Object.fromEntries(map_to_save);
}
async function compressData(data, path) {
  return new Promise((resolve, reject) => {
    try {
      let compressPackStream = new PackrStream;
      let file = new Writer(path);
      compressPackStream.write(data);
      compressPackStream.on("data", (packed) => {
        file.write(Zlib.brotliCompressSync(packed));
        resolve(true);
      });
      compressPackStream.end();
    } catch (error) {
      reject(error);
    }
  });
}
async function decompressData(path = "") {
  return new Promise((resolve, reject) => {
    try {
      const uncompressStream = new UnpackrStream;
      path = path || join2(process.cwd(), "./b/one.liteq");
      const file = createReadStream(path);
      const pipe = pipeline(file, Zlib.createBrotliDecompress(), uncompressStream, (err) => {
        if (err) {
          reject(err);
        }
      });
      pipe.on("finish", () => {
        resolve(pipe.read());
      });
    } catch (error) {
      reject(error);
    }
  });
}
async function loadConfig(path = "") {
  try {
    return await decompressData(path);
  } catch (error) {
    return null;
  }
}
async function writeConfig(path = "", data) {
  try {
    return await compressData(data, path);
  } catch (error) {
    return null;
  }
}
Queue.addJob({ id: "test", fn: async (path) => {
  const Zlib2 = await import("node:zlib");
  const { UnpackrStream: UnpackrStream2 } = await import("msgpackr");
  const { createReadStream: createReadStream2 } = await import("node:fs");
  const { join: join3 } = await import("node:path");
  const { pipeline: pipeline2 } = await import("node:stream");
  return new Promise((resolve, reject) => {
    try {
      const uncompressStream = new UnpackrStream2;
      const path2 = join3(process.cwd(), "./b/one.liteq");
      const file = createReadStream2(path2);
      const pipe = pipeline2(file, Zlib2.createBrotliDecompress(), uncompressStream, (err) => {
        if (err) {
          reject(err);
        }
      });
      pipe.on("finish", () => {
        console.log("bb");
        resolve(pipe.read());
      });
    } catch (error) {
      reject(error);
    }
  });
} }, (ev) => {
  console.log(ev, "ev");
});
Queue.onCompleted((d) => console.log(d, "d"));
Queue.onError((e) => console.log(e, "e"));
async function getDocumentById(id = "", dpath = "") {
  try {
    const path = join2(dpath, `${id}.liteq`);
    return await decompressData(path);
  } catch (error) {
    return null;
  }
}
async function putDocumentById(id = "", data = {}, dpath = "") {
  try {
    const path = join2(dpath, `${id}.liteq`);
    await compressData(data, path);
    return data;
  } catch (error) {
    return null;
  }
}
async function removeDocument(id = "", dpath = "") {
  try {
    let filepath = join2(dpath, `${id}.liteq`);
    Bun.file(filepath).delete() || rmSync(filepath, { recursive: true, retryDelay: 101 });
    return Promise.resolve({ iserror: false, msg: "document removed", id });
  } catch (error) {
    return Promise.reject({ iserror: true, msg: "document removed", id: null });
  }
}
async function removeAttachment(att = "", dpath = "") {
  try {
    let filepath = join2(dpath, `./attachments/${att}.liteq`);
    Bun.file(filepath).delete() || rmSync(filepath, { recursive: true, retryDelay: 101 });
    return Promise.resolve({ iserror: false, msg: "attachment removed", file: att });
  } catch (error) {
    return Promise.reject({ iserror: true, msg: "attachment removed", file: null });
  }
}

// src/service-enc.ts
import crypto2 from "node:crypto";
function getInit() {
  return crypto2.randomBytes(16);
}
function encrypt(text, key) {
  let iv = getInit();
  let cipher = crypto2.createCipheriv("aes256", Buffer.from(key), iv);
  let encryptedData = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    encryptedData,
    full: "".concat(iv.toString("hex"), encryptedData)
  };
}
function decrypt(text, Iv, key) {
  try {
    let iv = Buffer.from(Iv, "hex");
    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto2.createDecipheriv("aes256", Buffer.from(key), iv);
    let decryptedData = decipher.update(encryptedText, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    if (decryptedData) {
      return decryptedData;
    }
  } catch (error) {
    throw new Error("liteq: bad encrypted data provided,provide encrypted string");
  }
}

// src/storage.ts
import { join as join3 } from "node:path";
import { readFileSync as readFileSync2, rmSync as rmSync2, createWriteStream as createWriteStream2, existsSync, mkdirSync } from "node:fs";
import { pipeline as pipeline2 } from "node:stream";
import { Jimp } from "jimp";
import Zlib2 from "node:zlib";

// ../../node_modules/eventemitter3/index.mjs
var import__ = __toESM(require_eventemitter3(), 1);
var eventemitter3_default = import__.default;

// src/storage.ts
var _Emmiter = new eventemitter3_default;
async function decompressImage(compressed) {
  try {
    const uncompressed = Bun.inflateSync(compressed) || Zlib2.inflateSync(compressed);
    return uncompressed;
  } catch (error) {
    return null;
  }
}
async function compressImage(image, path = "", docid = "") {
  try {
    const br = Zlib2.createBrotliCompress();
    const img = await Jimp.read(image) || Jimp.fromBuffer(image) || Jimp.fromBitmap(image);
    const img_blob = new Blob(await img.getBuffer(img.mime));
    let newimg = {
      id: Bun.randomUUIDv7() || nanoid(16),
      type: "image",
      mime: img.mime,
      path: "",
      original_size: bytesForHuman(img_blob.size)
    };
    newimg.path = join3(path, `./attachments/${newimg.id}.br`);
    pipeline2(img_blob.stream(), br, createWriteStream2(newimg.path), async (err) => {
      if (err) {
        _Emmiter.emit("image_error", err);
      } else {
        const config = await loadConfig(join3(path, "config.liteq"));
        if (config) {
          let filtered = config.docs.filter((doc) => doc.key !== docid);
          let found = config.docs.find((doc) => doc.key === docid);
          if (found) {
            found.updated_at = Date.now();
            found._attachments.push(newimg);
            filtered.push(found);
            config.docs = filtered;
            await writeConfig(join3(path, "config.liteq"), config);
          }
        }
        let st = setTimeout(() => {
          _Emmiter.emit("image_created", newimg);
          clearTimeout(st);
        }, 2);
      }
    });
  } catch (error) {
    return null;
  }
}
async function getImage(id = "", dpath = "") {
  try {
    let path = join3(dpath, `./attachments/${id}.liteq`);
    return Jimp.read(await decompressImage(await Bun.file(path).arrayBuffer()) || await decompressImage(readFileSync2(path)));
  } catch (error) {
    return null;
  }
}
async function putImage(image, path = "", docid = "") {
  try {
    if (!existsSync(join3(path, "attachments"))) {
      mkdirSync(join3(path, "attachments"), { recursive: true });
    }
    return new Promise((resolve, reject) => {
      compressImage(image, path, docid).then(() => {
        _Emmiter.on("image_error", (err) => {
          reject(err);
        });
        _Emmiter.on("image_created", (data) => {
          resolve(data);
        });
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
async function removeImage(found, id = "", path = "") {
  try {
    let path_to_remove = join3(path, `./attachments/${id}.br`);
    if (found) {
      let attachment_to_remove = found?._attachments.find((att) => att.id === id);
      if (!attachment_to_remove)
        return Promise.resolve({
          iserror: true,
          msg: "attachment not found",
          id,
          error: null
        });
      await Bun.file(path_to_remove).delete() || rmSync2(path_to_remove, { recursive: true });
      const config = await loadConfig(join3(path, "config.liteq"));
      if (config) {
        let filtered = config.docs.filter((doc) => doc.key !== found2.key);
        let found2 = config.docs.find((doc) => doc.key === found2.key);
        if (found2) {
          found2.updated_at = Date.now();
          found2._attachments = found2._attachments.filter((att) => att.id !== id);
          filtered.push(found2);
          config.docs = filtered;
          await writeConfig(join3(path, "config.liteq"), config);
          let st = setTimeout(() => {
            _Emmiter.emit("attachment_removed", {
              iserror: false,
              msg: "success",
              id,
              error: null
            });
          }, 2);
          return Promise.resolve({
            iserror: false,
            msg: "success",
            id,
            error: null
          });
        }
      }
    }
  } catch (error) {
    return Promise.reject({
      iserror: true,
      msg: "error occurred",
      id,
      error
    });
  }
}
async function putFileAttachment(file, path = "") {
  return new Promise((resolve, reject) => {
    try {
      let newfile = {
        id: Bun.randomUUIDv7("hex") || nanoid(16),
        type: "file",
        path: "",
        mime: file.type,
        original_size: bytesForHuman(file.size)
      };
      newfile.path = join3(path, `./attachments/${newfile.id}.br`);
      if (!existsSync(newfile.path)) {
        mkdirSync(join3(path, "./attachments"), { recursive: true });
      }
      pipeline2(file.stream(), Zlib2.createBrotliCompress(), createWriteStream2(newfile.path), (err) => {
        if (err) {
          reject({
            iserror: true,
            msg: "error occurred",
            file: null,
            error: err
          });
        }
      }).on("finish", () => {
        resolve({
          iserror: false,
          msg: "success",
          file: newfile,
          error: null
        });
      });
    } catch (error) {
      reject({
        iserror: true,
        msg: "error occurred",
        file: null,
        error
      });
    }
  });
}

// src/lite.ts
var _Emmiter2 = new Event;
function verify(dpath = "", dname = "") {
  if (dpath && typeof dpath === "string" && dpath.length > 0 && dname && typeof dname === "string" && dname.length > 0) {
    return { dpath, dname };
  }
  throw new Error("liteq: valid options required, path && dbname ").message;
}

class Liteq {
  #k;
  #full_db_path;
  #dpath;
  #dname;
  #conf_path;
  #useTtl;
  helpers;
  constructor(opts = { dbpath: join4(process.cwd(), ""), dbname: "b" }) {
    const { dpath, dname } = verify(opts.dbpath, opts.dbname);
    this.#full_db_path = join4(dpath, dname);
    this.#dpath = dpath;
    this.#dname = dname;
    this.#k = `${dname}_liteqversion1_bun`;
    this.#conf_path = join4(this.#full_db_path.trim(), "./config.liteq");
    this.helpers = {
      encrypt: (text = "") => {
        if (!text || typeof text !== "string" || text.length === 0) {
          throw new Error("liteq: text must be string and not empty");
        }
        return String(encrypt(text, this.#k).full);
      },
      decrypt: (text = "") => {
        if (!text || typeof text !== "string" || text.length === 0) {
          throw new Error("liteq: text must be encrypted string and not empty");
        }
        let iv = text.slice(0, 32);
        let hash = text.slice(32);
        let decrypted = decrypt(hash, iv, this.#k);
        if (decrypted) {
          return decrypted;
        }
      },
      genUuid: (n = 16) => {
        if (n && typeof n === "number" && n >= 16) {
          return Bun.randomUUIDv7("hex") || nanoid(n);
        }
        throw new Error("liteq: genUuid requires number greater than 16 === 16");
      }
    };
    if (!existsSync2(this.#full_db_path)) {
      try {
        mkdirSync2(this.#full_db_path, { recursive: true });
      } catch (error) {
        throw new Error("liteq: failed to initialize db");
      }
    }
    if (!existsSync2(this.#conf_path)) {
      createFile(this.#conf_path);
      let delay_timeout = setTimeout(() => {
        writeConfig(this.#conf_path, { docs: [], count: 0 });
        clearTimeout(delay_timeout);
      }, 2);
    }
    this.#useTtl = () => {
      let i = setInterval(async () => {
        clearInterval(i);
        const config = await loadConfig(this.#conf_path);
        config?.docs.forEach((_conf) => {
          if (_conf.ttl !== 0 && Number(_conf.ttl) + Number(1) <= Date.now()) {
            this.remove(_conf.key);
          }
        });
      }, 1000);
    };
    this.#useTtl();
    return this;
  }
  get path() {
    return this.#dpath;
  }
  get name() {
    return this.#dname;
  }
  async info() {
    const config = await loadConfig(this.#conf_path);
    return config;
  }
  onChange(cb = (ev) => {}) {
    if (cb && typeof cb === "function") {
      _Emmiter2.on("change", (data) => {
        return cb(data.data);
      });
    }
  }
  async get(id, cb) {
    if (!id || typeof id !== "string" || id.length === 0) {
      return Promise.reject(new Error("liteq: get,requires id"));
    }
    try {
      const config = await loadConfig(this.#conf_path);
      let found = config?.docs.find((_doc) => _doc.key === id);
      if (found) {
        _Emmiter2.on("change", (data) => {
          if (cb && typeof cb === "function") {
            if (data.data.key === id)
              cb(data.data);
          }
        });
        return new Promise((resolve, reject) => {
          const timmer = setTimeout(async () => {
            const doc = await getDocumentById(id, this.#full_db_path);
            found.data = doc;
            resolve(found);
            clearTimeout(timmer);
          }, 100);
        });
      }
      if (cb && typeof cb === "function")
        cb(null);
      return Promise.resolve(null);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async set(id = Bun.randomUUIDv7("hex") || nanoid(16), data = {}, ttl = 0) {
    if (!id && typeof id !== "string" || id.length === 0 && !data || typeof data !== "object" && typeof ttl !== "number") {
      return Promise.reject(new Error("liteq: set,requires valid options,id,data and optional ttl"));
    }
    try {
      const config = await loadConfig(this.#conf_path);
      const found = config?.docs?.find((c) => c.key === id);
      const data_to_save = await getDocumentById(found?.key, this.#full_db_path);
      const filtered = config?.docs?.filter((c) => c.key !== id);
      if (found) {
        data_to_save._attachments = found?._attachments || [];
        data_to_save.data = loopMerged(import_deepmerge.default(data_to_save.data, data));
        await putDocumentById(id, data_to_save.data, this.#full_db_path);
        found.ttl = ttl;
        found.updated_at = Date.now();
        filtered.push(found);
        if (config) {
          config.docs = filtered;
          const conf_timmer = setTimeout(async () => {
            await writeConfig(this.#conf_path, config);
            clearTimeout(conf_timmer);
          }, 2);
        }
        const timmer = setTimeout(() => {
          found.data = data_to_save.data;
          _Emmiter2.emit("change", found);
          clearTimeout(timmer);
        }, 2);
        return Promise.resolve(found);
      }
      const newdata = {
        key: id,
        ttl,
        created_at: Date.now(),
        updated_at: Date.now(),
        _attachments: []
      };
      if (config) {
        config?.docs.push(newdata);
        config.count = config?.count + 1;
        const conftimmer = setTimeout(async () => {
          await writeConfig(this.#conf_path, config);
          clearTimeout(conftimmer);
        }, 2);
      }
      await putDocumentById(id, data_to_save?.data, this.#full_db_path);
      setTimeout(() => {
        _Emmiter2.emit("change", {
          _id: newdata.key,
          data,
          ttl: newdata.ttl,
          created_at: newdata.created_at,
          updated_at: newdata.updated_at,
          _attachments: newdata._attachments
        });
      }, 2);
      return Promise.resolve({
        _id: newdata.key,
        data,
        ttl: newdata.ttl,
        created_at: newdata.created_at,
        updated_at: newdata.updated_at,
        _attachments: newdata._attachments
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async remove(id = "") {
    if (!id || typeof id !== "string" || id.length === 0)
      return Promise.reject(new Error("liteq: remove requires valid id"));
    try {
      const config = await loadConfig(this.#conf_path);
      if (config) {
        const found = config.docs.find((d) => d.key === id);
        if (!found)
          return Promise.resolve({
            iserror: true,
            msg: "not found",
            id
          });
        const removed = await removeDocument(id, this.#full_db_path);
        for (const doc of found._attachments) {
          await removeAttachment(doc.id || doc, this.#full_db_path);
        }
        const filtered = config?.docs.filter((c) => c.key !== id);
        config.count = config.count - 1;
        config.docs = filtered;
        await writeConfig(this.#conf_path, config);
        setTimeout(() => _Emmiter2.emit("remove", removed), 8);
        return Promise.resolve(removed);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  onRemoved(cb = (ev) => {}) {
    if (cb && typeof cb === "function") {
      _Emmiter2.on("remove", (data) => {
        return cb(data.data);
      });
    }
  }
  async clear() {
    try {
      const config = await loadConfig(this.#conf_path);
      for await (let doc of config.docs) {
        const removed = await removeDocument(doc.key, this.#full_db_path);
        for (const _att of doc._attachments) {
          await removeAttachment(doc.id || _att, this.#full_db_path);
        }
        setTimeout(() => {
          _Emmiter2.emit("clear", removed);
        }, 8);
      }
      await writeConfig(this.#conf_path, { docs: [], count: 0 });
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async getKeys() {
    let config = await this.info();
    let keys = [];
    for (let ke of config.docs) {
      keys.push(ke.key);
    }
    return {
      keys,
      count: config.length
    };
  }
  onCleared(cb = () => {}) {
    if (cb && typeof cb === "function") {
      _Emmiter2.on("clear", (data) => {
        return cb(data);
      });
    }
  }
  getSize() {
    return new Promise((resolve, reject) => {
      stat(this.#full_db_path, async (err, stats) => {
        if (!err) {
          if (stats) {
            resolve(bytesForHuman(stats.blksize));
          }
        } else {
          resolve(bytesForHuman(0));
        }
      });
    });
  }
  attachments = {
    image: {
      get: async (opts = { docid: "", id: "" }) => {
        if (!opts || checktype(opts) !== checktype({}) || !opts.docid || typeof opts.docid !== "string" || opts.docid.length === 0 || !opts.id || typeof opts.id !== "string" || opts.id.length === 0) {
          return {
            iserror: true,
            msg: "valid options required",
            image: null,
            error: null
          };
        }
        const config = await loadConfig(this.#conf_path);
        let found = config?.docs.find((c) => c.key === opts.docid);
        if (!found) {
          return {
            iserror: true,
            msg: "document not found",
            image: null,
            error: null
          };
        }
        return {
          iserror: false,
          msg: "success",
          image: await getImage(opts.id, this.#full_db_path),
          error: null
        };
      },
      getAll: async (id = "") => {
        if (id && typeof id === "string" && id.length > 0) {
          const config = await loadConfig(this.#conf_path);
          let found = config?.docs.find((c) => c.key === id);
          if (!found) {
            return {
              iserror: true,
              msg: "document not found",
              image: null,
              error: null
            };
          }
          for await (let img of found._attachments) {
            if (img.type === "image") {
              let all_get_promises = [];
              all_get_promises.push(this.attachments.image.get(id, img.id));
              return Promise.all(all_get_promises);
            }
          }
        } else {
          return {
            iserror: true,
            msg: "document id required",
            image: null,
            error: null
          };
        }
      },
      put: async (id = "", image = "") => {
        if (id && typeof id === "string" && id.length > 0 && image && image.length !== 0 && typeof image !== "number") {
          const config = await loadConfig(this.#conf_path);
          let found = config?.docs.find((c) => c.key === id);
          if (!found) {
            return {
              iserror: true,
              msg: "document not found",
              image: null,
              error: null
            };
          }
          return await putImage(image, this.#full_db_path, id);
        } else {
          return {
            iserror: true,
            msg: "document id and image url or blob required",
            image: null,
            error: null
          };
        }
      },
      remove: async (opts = { docid: "", id: "" }) => {
        if (!opts || checktype(opts) !== checktype({}) || !opts.docid || typeof opts.docid !== "string" || opts.docid.length === 0 || !opts.id || typeof opts.id !== "string" || opts.id.length === 0) {
          return {
            iserror: true,
            msg: "valid options required",
            image: null,
            error: null
          };
        }
        let config = await this.info();
        let found = config?.docs.find((c) => c.key === opts.docid);
        if (!found) {
          return {
            iserror: true,
            msg: "document not found",
            image: null,
            error: null
          };
        }
        return await removeImage(found, opts.id, this.#full_db_path);
      }
    },
    file: {
      put: async (docid = "", file) => {
        try {
          if (!docid || typeof docid !== "string" || docid.length === 0 || !file) {
            return {
              iserror: true,
              msg: "docid and file blob required",
              file: null,
              error: null
            };
          }
          const config = await this.info();
          let filtered = config?.docs.filter((doc) => doc.key !== docid);
          let found = config?.docs.find((doc) => doc.key === docid);
          console.log(found);
          if (!found) {
            return {
              iserror: true,
              msg: "document not found",
              image: null,
              error: null
            };
          }
          if (file instanceof Blob) {
            let res = await putFileAttachment(file, this.#full_db_path);
            if (res && res.msg === "success") {
              found.updated_at = Date.now();
              found._attachments.push(res.file);
              filtered.push(found);
              config.docs = filtered;
              await writeConfig(join4(this.#full_db_path, "./config.liteq"), config);
              return res;
            }
            return res;
          } else {
            return {
              iserror: true,
              msg: "file not instance of Blob",
              file: null,
              error: null
            };
          }
        } catch (error) {
          return {
            iserror: true,
            msg: "error occurred ",
            file: null,
            error
          };
        }
      }
    },
    info: async (docid = "") => {
      try {
        if (docid && typeof docid === "string" && docid.length > 0) {
          let config = await this.info();
          let found = config?.docs.find((c) => c.key === docid);
          if (!found) {
            return {
              iserror: true,
              msg: "document not found",
              attachments: [],
              error: null
            };
          }
          return {
            iserror: false,
            msg: "success",
            attachments: found._attachments,
            error: null
          };
        }
      } catch (err) {
        return {
          iserror: true,
          msg: "error occurred",
          attachment: [],
          error: err
        };
      }
    }
  };
}

// src/index.ts
var src_default = Liteq;
export {
  src_default as default,
  Liteq
};
