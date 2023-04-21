import { SharedData } from '../helpers/shared_data.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';

export const RBAC = (mode: string[]): any => {
    const sharedData: SharedData = SharedData.getInstance();

    if (!mode.includes(sharedData.mode)) {
        const error = new Error('The selected SDK mode not allow this operation')
        throw new MitError(error, ERROR_TYPES.MODE_NOT_ALLOWED);
    }
}