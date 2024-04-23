import { JSONFilePreset } from 'lowdb/node';
import {join} from 'node:path';

// Read or create db.json
const defaultliteconf = {
    dbs:[],
    litepath:join(process.cwd(),".pouchlite"),
}


const liteconf = await JSONFilePreset(join(defaultliteconf.litepath,"lite.config.json"), defaultliteconf)

export {
    liteconf
}