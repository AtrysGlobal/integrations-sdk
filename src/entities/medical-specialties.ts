import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints'
import { RBAC } from '../helpers/rbac.helper';

const sharedData = SharedData.getInstance();

/**
 * It makes a request to the API and returns the response
 * @returns A list of medical specialties
 */
export async function list(): Promise<object> {
    try {
        RBAC(['SDK_PATIENT', 'SDK_ADMIN']);

        const _request = new ClientRequest('ATRYS');
        const _req = await _request.get(endpoints.medicalSpecialties.list);
        if (_req.data.message !== 'OK') {
            throw new MitError(_req.data.message);
        }
        return _req;
    } catch (error: any) {
        throw new MitError(error, ERROR_TYPES.SPECIALTIES);
    }
}

export default { list };
