import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints'
import { RBAC } from '../helpers/rbac.helper';

const sharedData = SharedData.getInstance();

/**
 * It gets the base url of the clinic
 * @returns A url for clinic front end
 */
export const getBaseUrl = async (): Promise<string> => {
    try {
        RBAC(['SDK_PATIENT', 'SDK_ADMIN']);

        const _request = new ClientRequest('ATRYS');

        const _req = await _request.get(`${endpoints.clinic.get}/${sharedData.clinicId}`);

        if (_req.data.statusCode !== 200) {
            throw new MitError(_req.data.message);
        }

        return _req.data.payload.frontBaseUrl.replace('$', 'auth');
    } catch (error: any) {
        throw new MitError(error, ERROR_TYPES.CLINIC);
    }
}