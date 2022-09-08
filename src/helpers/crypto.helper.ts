import * as CryptoJS from 'crypto-js';
import config from '../config';

export class Crypto {
  encrypt(value: any) {
    const key = config('').CRYPTO_SEED;
    value = value instanceof String ? value : JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(value, key, { mode: CryptoJS.mode.CBC }).toString();
    return encodeURIComponent(encrypted);
  }

  decrypt(value: any): any {
    const key = config('').CRYPTO_SEED;
    const decrypted = CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decodeURIComponent(decrypted));
  }

  base64Encode(text: string): string {
    return Buffer.from(text).toString('base64');
  }

  base64Decode(encoded: string): string {
    return Buffer.from(encoded, 'base64').toString('binary')
  }
}
