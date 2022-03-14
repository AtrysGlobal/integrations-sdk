import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';

const sharedData = SharedData.getInstance();

export async function list(queryBlock: any): Promise<object> {
  try {
    if (!queryBlock) throw new Error('You must provide a queryBlock');

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.post('blocks/query', queryBlock);
    if (_req.data.message !== 'OK') {
      throw new Error(_req.data.message);
    }
    return _req;
  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.BLOCKS);
  }
}

export default { list };
