import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints'

const sharedData = SharedData.getInstance();

/**
 * It takes a patient model and returns a promise with the response from the server
 * @param {any} patientModel - This is the patient model that you will use to register a new patient.
 * @returns a promise that resolves to an object.
 */
export async function register(patientModel: any): Promise<object> {
  try {
    if (!patientModel) throw new Error('Yoy must provide a model for register a new patient');

    patientModel.newUserFromSDK = true;

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.post(endpoints.account.register, { ...patientModel });
    sharedData.patientId = _req.data.id;

    return _req;
  } catch (error: any) {
    throw new MitError(error);
  }
}

/**
 * It changes the password of the user.
 * @param {any} credentials - {
 * @returns The response from the server.
 */
export async function changePassword(credentials: any): Promise<object> {
  try {
    if (!credentials) throw new Error('Yoy must provide a credentials for patient operations');

    const _request = new ClientRequest('SDK');
    return _request.put(endpoints.account.changePasswordSdk, { ...credentials });

  } catch (error: any) {
    throw new MitError(error);
  }
}

export default { register, changePassword };
