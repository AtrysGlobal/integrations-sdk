interface IMitError {
    type: ERROR_TYPES;
}

export class MitError extends Error implements IMitError {
    public type: ERROR_TYPES;
    private code: string;
    private msg: string;

    constructor(error: any, type = ERROR_TYPES.UNKNOWN, code: string = '000') {
        if (error instanceof MitError) {
            //Primer caso: error es de tipo MitError, por lo tanto se pasan las propiedades del anterior MitError al actual
            //Esto evita que el error se muestre como Error: Error: Error: mensaje de error
            super(error.message)
            this.msg = error.msg;
            this.code = error.code;

            //Check del tipo de error, en caso de que el tipo venga de un MitError anterior y el nuevo tenga el valor por defecto (UNkNOWN)
            //Se chequea que el nuevo tipo sea UNKNOWN, de ser así se setea el type del MitError anterior, en caso contrario el type va a ser el que venga desde el constructor
            this.type = (type === ERROR_TYPES.UNKNOWN) ? error.type : type;
        } else {
            //Segundo caso, el error es de tipo string
            super(error);
            this.msg = error;
            this.type = type;
            this.code = code;
        }

        Object.setPrototypeOf(this, MitError.prototype);
    }

    //Metodo para mostrar el error en consola como objeto en lugar de string
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
    BAD_REQUEST = 'BAD_REQUEST'
}