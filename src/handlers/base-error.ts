export const errorDictionary = {
    STANDARD: {
        INTERNAL_SERVER_ERROR: {
            message: 'Internal Server Error',
            httpCode: 500,
        },
        BAD_REQUEST: {
            message: 'Bad Request',
            httpCode: 400,
        },
        UNAUTHORIZED: {
            message: 'Unauthorized',
            httpCode: 401,
        },
        FORBIDDEN: {
            message: 'Forbidden',
            httpCode: 403,
        },
        NOT_FOUND: {
            message: 'Not Found',
            httpCode: 404,
        },
        NOT_ACCEPTABLE: {
            message: 'Not Acceptable',
            httpCode: 406,
        },
    }
};


export type ErrorObject = {
    message: string;
    httpCode: number;
    description?: string;
};


/* It's a class that extends the Error class and it's used to handle errors in a more consistent way */
export class HttpErrorNew extends Error {
    public static errorDictionary = { ...errorDictionary };
    public errorObject = {} as ErrorObject;
    /**
     * If the errorObject is null, then we set the errorObject to the default error object. Otherwise,
     * we call the handleError function
     * @param {any} errorObject - This is the error object that is passed to the constructor.
     */
    constructor(errorObject: any) {
        super();
        if (!errorObject) {
            this.errorObject = { ...errorDictionary.STANDARD.INTERNAL_SERVER_ERROR }
        } else {
            this.errorObject = this.handleError(errorObject)
        }
    }

    /**
     * It takes an error object and returns an error object
     * @param {any} err - any - The error object that is passed to the function.
     * @returns An object with the following properties:
     *     - code: number
     *     - description: string
     *     - message: string
     */
    handleError(err: any) {
        let outError = {} as ErrorObject;
        const connectError = err.message.match(/connect ECONNREFUSED/)

        if (connectError) {
            outError = {
                ...errorDictionary.STANDARD.INTERNAL_SERVER_ERROR,
                description: err.message
            }
            return outError;

        }

        if (err.message === 'Yoy must provide a username for login' || err.message === 'Yoy must provide a password for login') {
            outError = {
                ...errorDictionary.STANDARD.UNAUTHORIZED,
                description: err.message
            }
            return outError;

        }

        if (err.message === 'Token is invalid') {
            outError = {
                ...errorDictionary.STANDARD.UNAUTHORIZED,
                description: err.message
            }
            return outError;

        }

        if (err instanceof TypeError || err instanceof Error) {
            outError = {
                ...errorDictionary.STANDARD.BAD_REQUEST,
                description: err.message
            }
            return outError;

        }
        return outError;
    }
}