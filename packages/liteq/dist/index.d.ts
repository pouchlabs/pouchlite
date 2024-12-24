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
    attachments: {
        image: {
            get: (opts?: {
                docid: string;
                id: string;
            }) => Promise<{
                iserror: boolean;
                msg: string;
                image: any;
                error: any;
            }>;
            getAll: (id: any) => Promise<{
                iserror: boolean;
                msg: string;
                image: {
                    bitmap: import("jimp").Bitmap;
                    background: number;
                    formats: import("@jimp/types").Format<any>[];
                    mime?: string;
                    inspect(): string;
                    toString(): string;
                    readonly width: number;
                    readonly height: number;
                    getBuffer<ProvidedMimeType extends "image/bmp" | "image/tiff" | "image/x-ms-bmp" | "image/gif" | "image/jpeg" | "image/png", Options extends (Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T ? T extends Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/tiff", Record<string, any> | undefined> extends infer T_1 ? T_1 extends Record<"image/tiff", Record<string, any> | undefined> ? T_1 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T_2 ? T_2 extends Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T_2 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/gif", Record<string, any> | undefined> extends infer T_3 ? T_3 extends Record<"image/gif", Record<string, any> | undefined> ? T_3 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/jpeg", import("jimp").JPEGOptions> extends infer T_4 ? T_4 extends Record<"image/jpeg", import("jimp").JPEGOptions> ? T_4 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> extends infer T_5 ? T_5 extends Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> ? T_5 extends Record<ProvidedMimeType, infer O> ? O : never : never : never)>(mime: ProvidedMimeType, options?: Options | undefined): Promise<Buffer>;
                    getBase64<ProvidedMimeType extends "image/bmp" | "image/tiff" | "image/x-ms-bmp" | "image/gif" | "image/jpeg" | "image/png", Options extends (Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T ? T extends Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/tiff", Record<string, any> | undefined> extends infer T_1 ? T_1 extends Record<"image/tiff", Record<string, any> | undefined> ? T_1 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T_2 ? T_2 extends Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T_2 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/gif", Record<string, any> | undefined> extends infer T_3 ? T_3 extends Record<"image/gif", Record<string, any> | undefined> ? T_3 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/jpeg", import("jimp").JPEGOptions> extends infer T_4 ? T_4 extends Record<"image/jpeg", import("jimp").JPEGOptions> ? T_4 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> extends infer T_5 ? T_5 extends Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> ? T_5 extends Record<ProvidedMimeType, infer O> ? O : never : never : never)>(mime: ProvidedMimeType, options?: Options | undefined): Promise<string>;
                    write<Extension extends string, Mime extends (Record<"bmp", "image/bmp"> extends infer T ? T extends Record<"bmp", "image/bmp"> ? T extends Record<Extension, infer M> ? M : never : never : never) | (Record<"tiff", "image/tiff"> extends infer T_1 ? T_1 extends Record<"tiff", "image/tiff"> ? T_1 extends Record<Extension, infer M> ? M : never : never : never) | (Record<"x-ms-bmp", "image/x-ms-bmp"> extends infer T_2 ? T_2 extends Record<"x-ms-bmp", "image/x-ms-bmp"> ? T_2 extends Record<Extension, infer M> ? M : never : never : never) | (Record<"gif", "image/gif"> extends infer T_3 ? T_3 extends Record<"gif", "image/gif"> ? T_3 extends Record<Extension, infer M> ? M : never : never : never) | (Record<"jpeg", "image/jpeg"> extends infer T_4 ? T_4 extends Record<"jpeg", "image/jpeg"> ? T_4 extends Record<Extension, infer M> ? M : never : never : never) | (Record<"png", "image/png"> extends infer T_5 ? T_5 extends Record<"png", "image/png"> ? T_5 extends Record<Extension, infer M> ? M : never : never : never), Options extends (Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T_6 ? T_6 extends Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T_6 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/tiff", Record<string, any> | undefined> extends infer T_7 ? T_7 extends Record<"image/tiff", Record<string, any> | undefined> ? T_7 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T_8 ? T_8 extends Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T_8 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/gif", Record<string, any> | undefined> extends infer T_9 ? T_9 extends Record<"image/gif", Record<string, any> | undefined> ? T_9 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/jpeg", import("jimp").JPEGOptions> extends infer T_10 ? T_10 extends Record<"image/jpeg", import("jimp").JPEGOptions> ? T_10 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> extends infer T_11 ? T_11 extends Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> ? T_11 extends Record<Mime, infer O> ? O : never : never : never)>(path: `${string}.${Extension}`, options?: Options | undefined): Promise<void>;
                    clone<S extends unknown>(this: S): S;
                    getPixelIndex(x: number, y: number, edgeHandling?: import("jimp").Edge): number;
                    getPixelColor(x: number, y: number): number;
                    setPixelColor(hex: number, x: number, y: number): any;
                    hasAlpha(): boolean;
                    composite<I extends unknown>(src: I, x?: number, y?: number, options?: {
                        mode?: import("@jimp/core").BlendMode;
                        opacitySource?: number;
                        opacityDest?: number;
                    }): any;
                    scan(f: (x: number, y: number, idx: number) => any): any;
                    scan(x: number, y: number, w: number, h: number, cb: (x: number, y: number, idx: number) => any): any;
                    scanIterator(x?: number, y?: number, w?: number, h?: number): Generator<{
                        x: number;
                        y: number;
                        idx: number;
                        image: any;
                    }, void, unknown>;
                } & import("@jimp/core").JimpInstanceMethods<{
                    bitmap: import("jimp").Bitmap;
                    background: number;
                    formats: import("@jimp/types").Format<any>[];
                    mime?: string;
                    inspect(): string;
                    toString(): string;
                    readonly width: number;
                    readonly height: number;
                    getBuffer<ProvidedMimeType extends "image/bmp" | "image/tiff" | "image/x-ms-bmp" | "image/gif" | "image/jpeg" | "image/png", Options extends (Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T ? T extends Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/tiff", Record<string, any> | undefined> extends infer T_1 ? T_1 extends Record<"image/tiff", Record<string, any> | undefined> ? T_1 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T_2 ? T_2 extends Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T_2 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/gif", Record<string, any> | undefined> extends infer T_3 ? T_3 extends Record<"image/gif", Record<string, any> | undefined> ? T_3 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/jpeg", import("jimp").JPEGOptions> extends infer T_4 ? T_4 extends Record<"image/jpeg", import("jimp").JPEGOptions> ? T_4 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> extends infer T_5 ? T_5 extends Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> ? T_5 extends Record<ProvidedMimeType, infer O> ? O : never : never : never)>(mime: ProvidedMimeType, options?: Options | undefined): Promise<Buffer>;
                    getBase64<ProvidedMimeType extends "image/bmp" | "image/tiff" | "image/x-ms-bmp" | "image/gif" | "image/jpeg" | "image/png", Options extends (Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T ? T extends Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/tiff", Record<string, any> | undefined> extends infer T_1 ? T_1 extends Record<"image/tiff", Record<string, any> | undefined> ? T_1 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T_2 ? T_2 extends Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T_2 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/gif", Record<string, any> | undefined> extends infer T_3 ? T_3 extends Record<"image/gif", Record<string, any> | undefined> ? T_3 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/jpeg", import("jimp").JPEGOptions> extends infer T_4 ? T_4 extends Record<"image/jpeg", import("jimp").JPEGOptions> ? T_4 extends Record<ProvidedMimeType, infer O> ? O : never : never : never) | (Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> extends infer T_5 ? T_5 extends Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> ? T_5 extends Record<ProvidedMimeType, infer O> ? O : never : never : never)>(mime: ProvidedMimeType, options?: Options | undefined): Promise<string>;
                    write<Extension extends string, Mime extends (Record<"bmp", "image/bmp"> extends infer T ? T extends Record<"bmp", "image/bmp"> ? T extends Record<Extension, infer M> ? M : never : never : never) | (Record<"tiff", "image/tiff"> extends infer T_1 ? T_1 extends Record<"tiff", "image/tiff"> ? T_1 extends Record<Extension, infer M> ? M : never : never : never) | (Record<"x-ms-bmp", "image/x-ms-bmp"> extends infer T_2 ? T_2 extends Record<"x-ms-bmp", "image/x-ms-bmp"> ? T_2 extends Record<Extension, infer M> ? M : never : never : never) | (Record<"gif", "image/gif"> extends infer T_3 ? T_3 extends Record<"gif", "image/gif"> ? T_3 extends Record<Extension, infer M> ? M : never : never : never) | (Record<"jpeg", "image/jpeg"> extends infer T_4 ? T_4 extends Record<"jpeg", "image/jpeg"> ? T_4 extends Record<Extension, infer M> ? M : never : never : never) | (Record<"png", "image/png"> extends infer T_5 ? T_5 extends Record<"png", "image/png"> ? T_5 extends Record<Extension, infer M> ? M : never : never : never), Options extends (Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T_6 ? T_6 extends Record<"image/bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T_6 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/tiff", Record<string, any> | undefined> extends infer T_7 ? T_7 extends Record<"image/tiff", Record<string, any> | undefined> ? T_7 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> extends infer T_8 ? T_8 extends Record<"image/x-ms-bmp", {
                        palette?: import("bmp-ts").BmpColor[] | undefined;
                        colors?: number | undefined;
                        importantColors?: number | undefined;
                        hr?: number | undefined;
                        vr?: number | undefined;
                        reserved1?: number | undefined;
                        reserved2?: number | undefined;
                    }> ? T_8 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/gif", Record<string, any> | undefined> extends infer T_9 ? T_9 extends Record<"image/gif", Record<string, any> | undefined> ? T_9 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/jpeg", import("jimp").JPEGOptions> extends infer T_10 ? T_10 extends Record<"image/jpeg", import("jimp").JPEGOptions> ? T_10 extends Record<Mime, infer O> ? O : never : never : never) | (Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> extends infer T_11 ? T_11 extends Record<"image/png", Omit<import("@jimp/js-png").PNGJSOptions, "filterType" | "colorType" | "inputColorType"> & {
                        filterType?: import("jimp").PNGFilterType;
                        colorType?: import("jimp").PNGColorType;
                        inputColorType?: import("jimp").PNGColorType;
                    }> ? T_11 extends Record<Mime, infer O> ? O : never : never : never)>(path: `${string}.${Extension}`, options?: Options | undefined): Promise<void>;
                    clone<S extends unknown>(this: S): S;
                    getPixelIndex(x: number, y: number, edgeHandling?: import("jimp").Edge): number;
                    getPixelColor(x: number, y: number): number;
                    setPixelColor(hex: number, x: number, y: number): any;
                    hasAlpha(): boolean;
                    composite<I extends unknown>(src: I, x?: number, y?: number, options?: {
                        mode?: import("@jimp/core").BlendMode;
                        opacitySource?: number;
                        opacityDest?: number;
                    }): any;
                    scan(f: (x: number, y: number, idx: number) => any): any;
                    scan(x: number, y: number, w: number, h: number, cb: (x: number, y: number, idx: number) => any): any;
                    scanIterator(x?: number, y?: number, w?: number, h?: number): Generator<{
                        x: number;
                        y: number;
                        idx: number;
                        image: any;
                    }, void, unknown>;
                }, {
                    blit<I extends import("@jimp/types").JimpClass>(image: I, options: import("@jimp/plugin-blit").BlitOptions): I;
                } & {
                    blur<I extends import("@jimp/types").JimpClass>(image: I, r: number): I;
                    gaussian<I extends import("@jimp/types").JimpClass>(image: I, r: number): I;
                } & {
                    circle<I extends import("@jimp/types").JimpClass>(image: I, options?: import("jimp").CircleOptions): I;
                } & {
                    normalize<I extends import("@jimp/types").JimpClass>(image: I): I;
                    invert<I extends import("@jimp/types").JimpClass>(image: I): I;
                    brightness<I extends import("@jimp/types").JimpClass>(image: I, val: number): I;
                    contrast<I extends import("@jimp/types").JimpClass>(image: I, val: number): I;
                    posterize<I extends import("@jimp/types").JimpClass>(image: I, n: number): I;
                    greyscale<I extends import("@jimp/types").JimpClass>(image: I): I;
                    opacity<I extends import("@jimp/types").JimpClass>(image: I, f: number): I;
                    sepia<I extends import("@jimp/types").JimpClass>(image: I): I;
                    fade<I extends import("@jimp/types").JimpClass>(image: I, f: number): I;
                    convolution<I extends import("@jimp/types").JimpClass>(image: I, options: {
                        kernel: number[][];
                        edgeHandling?: import("@jimp/types").Edge | undefined;
                    } | number[][]): I;
                    opaque<I extends import("@jimp/types").JimpClass>(image: I): I;
                    pixelate<I extends import("@jimp/types").JimpClass>(image: I, options: number | {
                        size: number;
                        x?: number | undefined;
                        y?: number | undefined;
                        w?: number | undefined;
                        h?: number | undefined;
                    }): I;
                    convolute<I extends import("@jimp/types").JimpClass>(image: I, options: number[][] | {
                        kernel: number[][];
                        x?: number | undefined;
                        y?: number | undefined;
                        w?: number | undefined;
                        h?: number | undefined;
                    }): I;
                    color<I extends import("@jimp/types").JimpClass>(image: I, actions: import("jimp").ColorAction[]): I;
                } & {
                    contain<I extends import("@jimp/types").JimpClass>(image: I, options: import("jimp").ContainOptions): I;
                } & {
                    cover<I extends import("@jimp/types").JimpClass>(image: I, options: import("jimp").CoverOptions): I;
                } & {
                    crop<I extends import("@jimp/types").JimpClass>(image: I, options: import("jimp").CropOptions): I;
                    autocrop<I extends import("@jimp/types").JimpClass>(image: I, options?: import("jimp").AutocropOptions): I;
                } & {
                    displace<I extends import("@jimp/types").JimpClass>(image: I, options: import("jimp").DisplaceOptions): I;
                } & {
                    dither<I extends import("@jimp/types").JimpClass>(image: I): I;
                } & {
                    fisheye<I extends import("@jimp/types").JimpClass>(image: I, options?: import("jimp").FisheyeOptions): I;
                } & {
                    flip<I extends import("@jimp/types").JimpClass>(image: I, options: import("jimp").FlipOptions): I;
                } & {
                    pHash<I extends import("@jimp/types").JimpClass>(image: I): string;
                    hash<I extends import("@jimp/types").JimpClass>(image: I, base?: number): string;
                    distanceFromHash<I extends import("@jimp/types").JimpClass>(image: I, compareHash: string): number;
                } & {
                    mask<I extends import("@jimp/types").JimpClass>(image: I, options: import("@jimp/plugin-mask").MaskOptions): I;
                } & {
                    print<I extends import("@jimp/types").JimpClass>(image: I, { font, ...options }: import("@jimp/plugin-print").PrintOptions & {
                        font: import("@jimp/plugin-print").BmFont<I>;
                    }): I;
                } & {
                    resize<I extends import("@jimp/types").JimpClass>(image: I, options: import("jimp").ResizeOptions): I;
                    scale<I extends import("@jimp/types").JimpClass>(image: I, options: import("jimp").ScaleOptions): I;
                    scaleToFit<I extends import("@jimp/types").JimpClass>(image: I, options: import("jimp").ScaleToFitOptions): I;
                } & {
                    rotate<I extends import("@jimp/types").JimpClass>(image: I, options: import("@jimp/plugin-rotate").RotateOptions): I;
                } & {
                    threshold<I extends import("@jimp/types").JimpClass>(image: I, options: import("jimp").ThresholdOptions): I;
                } & {
                    quantize<I extends import("@jimp/types").JimpClass>(image: I, options: import("@jimp/plugin-quantize").QuantizeOptions): I;
                }>;
                error: any;
            }[] | {
                iserror: boolean;
                msg: string;
                image: any;
                error: any;
            }>;
            put: (id?: string, image?: string) => Promise<{
                iserror: boolean;
                msg: string;
                image: any;
                error: any;
            }>;
            remove: (opts?: {
                docid: string;
                id: string;
            }) => Promise<{
                iserror: boolean;
                msg: string;
                image: any;
                error: any;
            }>;
        };
    };
    #private;
}
