import { Crypto } from '../../helpers/crypto.helper';

describe('crypto helper tests', () => {
    test('should encrypt', () => {
        const text = 'hello world'
        const result = new Crypto().encrypt(text)
        expect(result).not.toBe(text)
    })

    // test('should dencrypt', () => {
    //     const text = 'hello world'
    //     const cryp = new Crypto()
    //     const encrypt = cryp.encrypt(text)
    //     const decrypt = cryp.decrypt(encrypt)
    //     expect(true).not.toBe(text)
    // })


})