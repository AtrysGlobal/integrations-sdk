interface IMitError {
    type: ERROR_TYPES;
}

/* It's a wrapper for the native Error class that allows you to pass in a custom error message, error
type, and error code */
export class MitError extends Error implements IMitError {
    public type: ERROR_TYPES;
    private code: string;
    private msg: string;

    /**
     * If the error is an instance of MitError, then set the message to the error's message, the type
     * to the error's type, and the code to the error's code. Otherwise, set the message to the error,
     * the type to the type passed in, and the code to the code passed in
     * @param {any} error - The error message.
     * @param type - The type of error.
     * @param {string} [code=000] - The error code.
     */
    constructor(error: any, type = ERROR_TYPES.UNKNOWN, code: string = '000') {
        if (error instanceof MitError) {
            super(error.message)

            this.msg = error.msg;
            this.type = (type === ERROR_TYPES.UNKNOWN) ? error.type : type;
            this.code = (code === '000') ? error.code : code;
        } else {
            super(error);

            this.msg = error;
            this.type = type;
            this.code = code;
        }

        Object.setPrototypeOf(this, MitError.prototype);
    }

    /**
     * It returns an object with the error code, message, and type
     * @returns An object with the properties code, message, and type.
     */
    toObject() {
        return {
            code: [this.type, this.code].join('_'),
            message: this.msg,
            type: this.type
        }
    }
}

export enum ERROR_TYPES {
    UNKNOWN = 'UNKNOWN',
    AUTH = 'AUTH',
    APPOINTMENTS = 'APPOINTMENTS',
    BLOCKS = 'BLOCKS',
    SPECIALTIES = 'SPECIALTIES',
    PROFESSIONALS = 'PROFESSIONALS',
    BAD_REQUEST = 'BAD_REQUEST',
    CLINIC = 'CLINIC',
    MODE_NOT_ALLOWED = 'MODE_NOT_ALLOWED'
}