import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { HttpErrorNew } from '../handlers/base-error';

const sharedData = SharedData.getInstance();

export async function list(): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get('medical-specialties');
    if (_req.data.message !== 'OK') {
      throw new Error(_req.data.message);
    }
    return _req;
  } catch (error: any) {
    throw new HttpErrorNew(error);
  }
}

export default { list };
