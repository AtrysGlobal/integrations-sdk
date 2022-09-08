interface IMitError {
    type: ERROR_TYPES;
}

export class MitError extends Error implements IMitError {
    public type: ERROR_TYPES;
    private code: string;
    private msg: string;

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
    CLINIC = 'CLINIC'
}