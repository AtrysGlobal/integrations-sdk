interface IMitError{
    type: ERROR_TYPES;
}

export class MitError extends Error implements IMitError{
    public type: ERROR_TYPES;

    constructor(msg: string, type = ERROR_TYPES.UNKNOWN) {
        super(msg);
        this.type = type;

        Object.setPrototypeOf(this, MitError.prototype);
    }
}

export enum ERROR_TYPES{
    UNKNOWN,
    AUTH,
    NO_PROFESSIONAL_CONNECTED,
    BAD_REQUEST
}