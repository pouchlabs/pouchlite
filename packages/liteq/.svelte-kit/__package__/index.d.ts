export class Liteq {
    constructor(opts?: {
        dpath: string;
        dbname: string;
    });
    dpath: string;
    dbname: string;
    helpers: {
        encrypt: (text: any) => string;
        decrypt: (text: any) => Buffer & string;
        genUuid: (n?: number) => string;
    };
    set(key: any, obj: any, ttl: any): Promise<any>;
    get(key: any): Promise<any>;
    remove(key?: string): Promise<any>;
    onRemoved(cb: any): void;
    clear(cb: any): void;
    change(cb: any): void;
    getSize(cb: any): void;
    getKeys(): {
        keys: any[];
        count: any;
    };
    onCleared(cb: any, ...args: any[]): void;
    #private;
}
