import { BROWSER } from 'esm-env';
import EventEmitter from 'eventemitter3';
import localforage from 'localforage';
import { LocalStoragePreset } from 'lowdb/browser';
import { nanoid } from 'nanoid';
import { get_many, get_single } from './get.js';
import { put_single, update_single } from './put.js';
import { remove_many, remove_single } from './remove.js';
import { checktype } from './utils.js';
import {Jimp} from "jimp";
function create_Collection_use(cname, config, dbname) {
  //
  const colEmitter = new EventEmitter();

  const local = localforage.createInstance({
    name: `pouchlite_db_${dbname}`,
    storeName: `${cname}_pouchlite`,
  });
  const found = config.data.cols.find((c) => c.name === cname);

  const current = {
    //attachments
    attachments:{
      image:{
        get:async (opts={docid:"",id:""})=>{
          if(!opts || checktype(opts) !== checktype({})  || !opts.docid || typeof opts.docid !== "string" || opts.docid.length === 0 || !opts.id || typeof opts.id !== "string" || opts.id.length === 0)
            {
              return{
                iserror:true,
                msg:"valid options required",
                image:null,
                error:null
              }
            }//
            let foundoc = await current.get(opts.docid); 
            
             if(foundoc.iserror){
              //null
              return foundoc
             }
             //found
             let attachments = foundoc.doc._attachments || [];
             let filtered = attachments.find(at=>at.id === opts.id);

             if(!filtered){
              return{
                iserror:true,
                msg:"image not found",
                doc:opts.docid,
                image:null,
                error:null
              }
             }
             //
             try {
              let img = await Jimp.read(filtered.data);
              return{
                iserror:false,
                msg:"success",
                image:{
                  id:filtered.id,
                  data:img
                },
                error:null
              }
             } catch (error) {
              return{
                iserror:true,
                msg:"error occured",
                image:null,
                error:error
              }
           
             }
        },
        getAll:async (opts={docid:"",ids:[]})=>{
          if(!opts || checktype(opts) !== checktype({})  || !opts.docid || typeof opts.docid !== "string" || opts.docid.length === 0 || !opts.ids ||  checktype(opts.ids) !== checktype([]) || opts.ids.length === 0)
            {
              return{
                iserror:true,
                msg:"valid options required",
                image:null,
                error:null
              }
            }//
            let foundoc = await current.get(opts.docid); 
            
             if(foundoc.iserror){
              //null
              return foundoc
             }
             //found
             //loop
             let images = [];
             for(let id of opts.ids){
              if(!id.id){
               let valid=await current.attachments.image.get({docid:opts.docid,id:id})
               if(valid.iserror){
                 
                return images
               }else{
                images.push(valid)
                return images
               }
              }
              
             }

        },
        remove: async (opts={docid:"",id:""})=>{
          if(!opts || checktype(opts) !== checktype({})  || !opts.docid || typeof opts.docid !== "string" || opts.docid.length === 0 || !opts.id || typeof opts.id !== "string" || opts.id.length === 0)
            {
              return{
                iserror:true,
                msg:"valid options required",
                image:null,
                error:null
              }
            }//
            let foundoc = await current.get(opts.docid); 
            
             if(foundoc.iserror){
              //null
              return foundoc
             }
             //found
             let attachments = foundoc.doc._attachments || [];
             let valid = attachments.find(f=>f.id === opts.id);
             if(!valid){
              return{
                iserror:true,
                msg:"image not found",
                doc:opts.docid,
                image:null,
                error:null
              }
             }
             let toupdate = foundoc.doc;
              toupdate._attachments = attachments.filter(at=>at.id !== opts.id);
          
             
             await current.put({id:opts.docid,data:toupdate})
             return{
              iserror:false,
              msg:"success",
              image:{
                id:opts.id,
                data:null
              },
              error:null
            }

        },
        put:async (image="",docid="")=>{
          if(!image || image.length === 0  || checktype(image)  === checktype({}) ||  typeof image === "number" && !docid || checktype(docid)  !== checktype("")|| docid.length === 0  || checktype(docid)  === checktype({}) )
            {
              return{
                iserror:true,
                msg:"valid image buffer,url or blob required && docid",
                image:null,
                error:null
              }
            }//
            let foundoc = await current.get(docid); 
            
             if(foundoc.iserror){
              //null
              return foundoc
             }
             //found
             let attachments = foundoc.doc._attachments || [];
             try {
              let img = await Jimp.read(image);
              let newimg ={
               id:nanoid(16),
               type:'image',
               mime:img.mime,
               data:await img.getBase64(img.mime)
               
              }
              attachments.push(newimg)
              await current.update({id:docid,data:{_attachments:attachments}})
              
              return{
                iserror:false,
                msg:"success",
                image:{
                  id:newimg.id,
                  data:img
                },
                error:null
              }
             } catch (error) {
              return{
                iserror:true,
                msg:"error occured",
                image:null,
                error:error
              }
           
             }
           
        }
      },
    },
    info:()=>{
      return found
    },
    put: async (opts) => {
      return new Promise((resolve, reject) => {
        if (opts && checktype(opts) === checktype({})) {
          const id = opts.id || nanoid(16);
          const data = opts.data || null;
          if (data && checktype(data) === checktype({})) {
            const doc = put_single(id, data, local);
            colEmitter.emit('change', doc);
            resolve({
              iserror: false,
              msg: 'success',
              error: null,
              doc: doc,
            });
          } else {
            reject({
              iserror: true,
              msg: 'data object required',
              error: null,
              doc: null,
            });
          }

          reject({
            iserror: true,
            msg: 'data is required',
            error: null,
            doc: null,
          });
        }
        reject({
          iserror: true,
          msg: 'object required',
          error: null,
          doc: null,
        });
      });
    },
    get: (id) => {
      return new Promise((resolve, reject) => {
        if (!id || checktype(id) !== checktype('') || id.length === 0) {
          reject({
            iserror: true,
            msg: 'id string required not empty',
            error: null,
            doc: null,
          });
        }
        get_single(id, current, local).then((doc) => {
          if (doc) {
    
            resolve({
              iserror: false,
              msg: 'success',
              error: null,
              doc,
            });
         
          }
          reject({
            iserror: true,
            msg: 'not found',
            error: null,
            doc: null,
          });
        });
      });
    },
    remove: (id) => {
      return new Promise((resolve, reject) => {
        if (!id || checktype(id) !== checktype('') || id.length === 0) {
          reject({
            iserror: true,
            msg: 'id string required not empty',
            error: null,
            doc: null,
          });
        }
        remove_single(id, local, current).then((msg) => {
          if (msg === 'success') {
            resolve({
              iserror: false,
              msg,
              error: null,
              doc: null,
            });
          }
          reject({
            iserror: true,
            msg,
            error: null,
            doc: null,
          });
        });
      });
    },
    putMany: (opts) => {
      return new Promise((resolve, reject) => {
        if (opts && checktype(opts) === checktype([{}]) && opts.length > 0) {
          const docarr = [];
          opts.map((doc) => {
            doc.id = doc.id || nanoid(16);
            const docs = put_single(doc.id, doc, local);

            docarr.push(docs);

            resolve({
              iserror: false,
              msg: 'success',
              error: null,
              doc: docarr,
            });
          });
          if (docarr && docarr.length > 0) {
            colEmitter.emit('change', docarr);
          }
          return;
        }
        reject({
          iserror: true,
          msg: 'list object required not empty',
          error: null,
          doc: null,
        });
      });
    },
    updateMany: (opts) => {
      return new Promise((resolve, reject) => {
        if (opts && checktype(opts) === checktype([{}]) && opts.length > 0) {
          const docarr = [];

          opts.map(async (doc) => {
            if (doc.id && doc.data) {
              const docs = await update_single(doc.id, doc.data, local);

              if (docs) {
                docarr.push(docs);

                resolve({
                  iserror: false,
                  msg: 'success',
                  error: null,
                  doc: docarr,
                });
              }
              reject({
                iserror: true,
                msg: 'failed update',
                error: null,
                doc: null,
              });
            }
          });
          if (docarr && docarr.length > 0) {
            colEmitter.emit('change', docarr);
          }
          return;
        }
        reject({
          iserror: true,
          msg: 'list object required not empty',
          error: null,
          doc: null,
        });
      });
    },
    getMany: (ids) => {
      return new Promise((resolve, reject) => {
        if (!ids || checktype(ids) !== checktype(['']) || ids.length === 0) {
          reject({
            iserror: true,
            error: null,
            msg: 'ids list required',
            doc: null,
          });
        }

        get_many(ids, current, local).then((doc) => {
          resolve({
            iserror: false,
            error: null,
            msg: 'success',
            doc: doc,
          });
        });
      });
    },
    getAllDocs: async () => {
      const keys = await local.keys();
      const docs = [];
      for (const key of keys) {
        const doc = await local.getItem(key);
        docs.push(JSON.parse(doc));
      }
      return Promise.all(docs);
    },
    removeMany: (ids) => {
      return new Promise((resolve, reject) => {
        if (!ids || checktype(ids) !== checktype(['']) || ids.length === 0) {
          reject({
            iserror: true,
            error: null,
            msg: 'ids list required',
            doc: null,
          });
        }
        remove_many(ids, local, current).then((msg) => {
          if (msg === 'success') {
            resolve({
              iserror: false,
              error: null,
              msg,
              doc: null,
            });
          }
          reject({
            iserror: true,
            error: null,
            msg,
            doc: null,
          });
        });
      });
    },
    clear: async () => {
      try {
        config.data.cols.filter((col) => col.name !== cname);
        config.data.cols_nums = config.data.cols_nums--;
        config.write();
        local.dropInstance({ storeName: `${cname}_pouchlite` });
        return {
          iserror: false,
          error: null,
          msg: 'success',
          doc: null,
        };
      } catch (error) {
        throw {
          iserror: true,
          error: error,
          msg: 'error occured',
          doc: null,
        };
      }
    },
    change: (cb) => {
      if (cb && typeof cb === 'function') {
        colEmitter.on('change', async (data) => {
          return cb(data);
        });
      }
    },
    update: (opts) => {
      return new Promise((resolve, reject) => {
        if (opts && checktype(opts) === checktype({})) {
          if (
            !opts.id ||
            typeof opts.id !== 'string' ||
            !opts.data ||
            checktype(opts.data) !== checktype({})
          ) {
            reject({
              iserror: true,
              msg: 'valid id and data object required',
              error: null,
              doc: null,
            });
          }
          update_single(opts.id, opts.data, local)
            .then((doc) => {
              colEmitter.emit('change', doc);
              resolve({
                iserror: false,
                msg: 'success',
                error: null,
                doc,
              });
            })
            .catch((e) => {
              reject({
                iserror: true,
                msg: 'update failed',
                error: null,
                doc: null,
              });
            });
          return;
        }
        reject({
          iserror: true,
          msg: 'object required',
          error: null,
          doc: null,
        });
      });
    },
  }


  if (!found) {
    //create new
    const newcol = {
      name: cname.trim(),
      prefix_name: cname + '_pouchlite'.trim(),
      id: nanoid(16).trim(),
      db_to: `pouchlite_db_${dbname.trim()}`,
    };

    config.data.cols.push(newcol);
    config.data.cols_nums++;
    //save
    config.write();
    // current.name = newcol.name;
    // current.prefix_name = newcol.prefix_name;
    // current.id = newcol.id;
    // current.db_to = newcol.db_to;
  
   
    return current;
  }
  // current.name = found.name;
  // current.prefix_name = found.prefix_name;
  // current.id = found.id;
  // current.db_to = found.db_to;
  
  return current;
}

function Pouchlite(dbname) {
  if (!BROWSER) return;
  if (dbname && typeof dbname === 'string' && dbname.length > 0) {
    const defaultconf = {
      cols: [],
      name: dbname,
      cols_nums: 0,
    };
    const pouchlite_config = LocalStoragePreset('pouchlite_config', {
      dbs: [],
      alldbs_count: 0,
    });
    const config = LocalStoragePreset(`${dbname}_pouchlite`, defaultconf);
    config.write();
    const isok = localforage.config({ name: `pouchlite_db_${dbname}` });

    if (isok === false) return;

    //initials
    const dbfound = pouchlite_config.data.dbs.find(
      (db) => db.prefixed_name === `pouchlite_db_${dbname}`,
    );

    if (!dbfound) {
      //create new
      const newdb = {
        name: dbname,
        prefixed_name: `pouchlite_db_${dbname}`,
        collections: [],
        collections_count: 0,
        id: nanoid(16),
      };
      pouchlite_config.data.dbs.push(newdb);
      pouchlite_config.data.alldbs_count++;
      pouchlite_config.write();
      //todos tomorrow
    }
    return {
      info: () => {
        return {
          name: dbname,
          prefixed_name: `pouchlite_db_${dbname}`,
          collections: config.data.cols,
          cols_count: config.data.cols_nums,
        };
      }, //
      use: (_cname) => {
        if (!_cname) return;
        if (_cname && typeof _cname === 'string' && _cname.length > 0) {
          const col = create_Collection_use(_cname, config, dbname);
          return col;
        }
      },
      dropDb: (_name) => {
        if (!_name || typeof _name !== 'string' || _name.length === 0) {
          return {
            iserror: true,
            msg: 'db name string required',
          };
        }
        try {
          const db = pouchlite_config.data.dbs.find(
            (db) =>
              db.name === _name ||
              db.prefixed_name === _name ||
              db.id === _name,
          );
          if (db) {
            const filtered = pouchlite_config.data.dbs.filter(
              (d) => d.id !== db.id,
            );
            pouchlite_config.data.dbs = filtered;
            pouchlite_config.data.alldbs_count--;
            //save
            pouchlite_config.write();
            //drop
            localStorage.removeItem(`${db.name}_pouchlite`);
            localforage.dropInstance({ name: db.prefixed_name });

            return {
              iserror: false,
              msg: 'success',
              error: null,
            };
          }
          return {
            iserror: true,
            msg: 'not found',
            error: null,
          };
        } catch (error) {
          return {
            iserror: true,
            msg: 'error occured',
            error: error,
          };
        }
      },
      listAllDbs: () => {
        //list all dbs
        return {
          dbs: pouchlite_config.data.dbs,
          count: pouchlite_config.data.alldbs_count,
        };
      },
      dropAlldbs: () => {
        //drops all stores
        try {
          pouchlite_config.data.dbs.forEach((db) => {
            if (db.name) {
              localStorage.removeItem(`${db.name}_pouchlite`);
              localStorage.removeItem('pouchlite_config');
              localforage.dropInstance({ name: db.prefixed_name });
            }
          });
          return {
            iserror: false,
            msg: 'success',
            error: null,
          };
        } catch (error) {
          //
          return {
            iserror: true,
            msg: 'error occured',
            error: error,
          };
        }
      },
    }; //
  }
}

export { Pouchlite };
