import { HttpErrorNew, errorDictionary } from "../../handlers/base-error"

describe('base error tests', () => {

    test('should throw error when send undefined', () => {
        const result = new HttpErrorNew(undefined)
        const expected = errorDictionary.STANDARD.INTERNAL_SERVER_ERROR
        expect(result.errorObject).toEqual(expected)
    })

    test('should throw error when send null', () => {
        const result = new HttpErrorNew(null)
        const expected = errorDictionary.STANDARD.INTERNAL_SERVER_ERROR
        expect(result.errorObject).toEqual(expected)
    })

    test('should throw error when send wrong username', () => {
        const description = 'Yoy must provide a username for login'
        const result = new HttpErrorNew(new Error(description))
        const expected = {
            ...errorDictionary.STANDARD.UNAUTHORIZED,
            description
        }
        expect(result.errorObject).toEqual(expected)
    })

    test('should throw error when send wrong password', () => {
        const description = 'Yoy must provide a password for login'
        const result = new HttpErrorNew(new Error(description))
        const expected = {
            ...errorDictionary.STANDARD.UNAUTHORIZED,
            description
        }
        expect(result.errorObject).toEqual(expected)
    })
    
    test('should throw error when ECONNREFUSED', () => {
        const description = 'connect ECONNREFUSED 127.0.0.1:80'
        const result = new HttpErrorNew(new Error(description))
        const expected = {
            ...errorDictionary.STANDARD.INTERNAL_SERVER_ERROR,
            description
        }
        expect(result.errorObject).toEqual(expected)
    })

    test('should throw error when Token is invalid', () => {
        const description = 'Token is invalid'
        const result = new HttpErrorNew(new Error(description))
        const expected = {
            ...errorDictionary.STANDARD.UNAUTHORIZED,
            description
        }
        expect(result.errorObject).toEqual(expected)
    })

    test('should throw error when is bad request', () => {
        const result = new HttpErrorNew(new Error())
        const expected = {
            ...errorDictionary.STANDARD.BAD_REQUEST,
            description: ''
        }
        expect(result.errorObject).toEqual(expected)
    })

})