import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints'

const sharedData = SharedData.getInstance();

/**
 * > This function will return a list of blocks based on the queryBlock provided
 * @param {any} queryBlock - The queryBlock object is a JSON object that contains the following
 * properties:
 * @returns A list of blocks
 */
export async function list(queryBlock: any): Promise<object> {
  try {
    if (!queryBlock) throw new Error('You must provide a queryBlock');

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.post(endpoints.blocks.query, queryBlock);
    if (_req.data.message !== 'OK') {
      throw new Error(_req.data.message);
    }
    return _req;
  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.BLOCKS);
  }
}

/**
 * It returns a list of blocked days
 * @returns An object with the following structure:
 * {
 *   "message": "OK",
 *   "data": {
 *     "blockedDays": [
 *       {
 *         "id": 1,
 *         "date": "2020-01-01",
 *         "description": "New Year's Day"
 *       },
 *       {
 *         "id": 2,
 *         "
 */
export async function blockedDays(): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get(endpoints.blocks.blockedDays);
    if (_req.data.message !== 'OK') {
      throw new Error(_req.data.message);
    }
    return _req;
  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.BLOCKS);
  }
}

export default { list, blockedDays };
