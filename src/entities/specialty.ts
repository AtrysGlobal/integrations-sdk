import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';

const sharedData = SharedData.getInstance();

export async function list(specialtyId: string): Promise<object> {
  try {
    if (!specialtyId) throw new Error('You must provide a specialty id');

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get(`administrative/specialties/${specialtyId}`);
    if (_req.data.message !== 'OK') {
      throw new MitError(_req.data.message);
    }
    return _req;
  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.SPECIALTIES);
  }
}

export default { list };
