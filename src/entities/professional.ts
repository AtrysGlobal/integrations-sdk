import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints'

const sharedData = SharedData.getInstance();

/**
 * It returns a list of professionals by specialty
 * @param {string} specialtyId - string
 * @returns A list of professionals
 */
export async function listBySpecialty(specialtyId: string): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get(`${endpoints.professional.listBySpecialtyId}/${specialtyId}`);
    if (_req.data.message !== 'OK') {
      throw new MitError(_req.data.message);
    }
    return _req;
  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.PROFESSIONALS);
  }
}

/**
 * It makes a request to the server to get a list of professionals
 * @returns A list of professionals
 */
export async function list(): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get(endpoints.professional.list);
    if (_req.data.message !== 'OK') {
      throw new MitError(_req.data.message);
    }
    return _req;
  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.PROFESSIONALS);
  }
}

export default { listBySpecialty, list };
