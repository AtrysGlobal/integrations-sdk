import * as CryptoJS from 'crypto-js';
import config from '../config';

export class Crypto {
  /**
   * It takes a value, encrypts it, and returns the encrypted value
   * @param {any} value - The value to be encrypted.
   * @returns The encrypted value of the input.
   */
  encrypt(value: any) {
    const key = config('').CRYPTO_SEED;
    value = value instanceof String ? value : JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(value, key, { mode: CryptoJS.mode.CBC }).toString();
    return encodeURIComponent(encrypted);
  }

  /**
   * It takes a value, decrypts it using the CryptoJS library, and returns the decrypted value
   * @param {any} value - The value to be decrypted.
   * @returns The decrypted value of the encrypted value.
   */
  decrypt(value: any): any {
    const key = config('').CRYPTO_SEED;
    const decrypted = CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decodeURIComponent(decrypted));
  }

  /**
   * It takes a string, converts it to a Buffer, and then converts the Buffer to a base64 string
   * @param {string} text - The text to be encoded.
   * @returns The base64 encoded version of the text.
   */
  base64Encode(text: string): string {
    return Buffer.from(text).toString('base64');
  }

  /**
   * It takes a base64 encoded string and returns a decoded string
   * @param {string} encoded - The string to be decoded.
   * @returns The decoded string.
   */
  base64Decode(encoded: string): string {
    return Buffer.from(encoded, 'base64').toString('binary')
  }
}
