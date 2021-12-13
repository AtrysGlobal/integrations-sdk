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


export class HttpErrorNew extends Error {
    public static errorDictionary = { ...errorDictionary };
    public errorObject = {} as ErrorObject;
    constructor(errorObject: any) {
        super();
        if (!errorObject) {
            this.errorObject = { ...errorDictionary.STANDARD.INTERNAL_SERVER_ERROR }
        } else {
            this.errorObject = this.handleError(errorObject)
        }
    }

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