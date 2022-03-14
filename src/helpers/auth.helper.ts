import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';

export async function login(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const sharedData = SharedData.getInstance();

      if (!sharedData.patientUsername) reject(new Error('You must set a username for login in sharedData class'));
      if (!sharedData.patientPassword) reject(new Error('SDK must set a password for login in sharedData class, throught patient model in normalize model process'));

      const credentials = {
        username: sharedData.patientUsername,
        password: sharedData.patientPassword,
      };

      setTimeout(async () => {
        let _req: any;

        if (sharedData.mode === 'SDK_ALONE') {
          const _request = new ClientRequest('SDK');
          _req = await _request.post('/access/integrations', {});
        } else {
          const _request = new ClientRequest('ATRYS');
          _req = await _request.post('/access/login-web', { ...credentials });

          sharedData.patientId = _req.data.id;
        }

        if (_req.data.message && _req.data.message === 'Las credenciales ingresadas son incorrectas o no existen') {
          reject(new Error(_req.data.message))
        }

        if (_req.data.httpCode && _req.data.httpCode === 400) {
          reject(new Error(_req.data.message))
        }

        sharedData.tokens.atrysBackend = _req.data.access_token;
        resolve(_req);

      }, 1500);
    } catch (error) {
      reject(error);
    }
  }).catch(error => {
    throw new MitError(error, ERROR_TYPES.AUTH);
  });
}

export default { login };
