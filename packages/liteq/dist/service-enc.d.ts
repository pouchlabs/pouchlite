export function encrypt(text: any, key: any): {
    iv: string;
    encryptedData: string;
    full: string;
};
export function decrypt(text: any, Iv: any, key: any): Buffer & string;
