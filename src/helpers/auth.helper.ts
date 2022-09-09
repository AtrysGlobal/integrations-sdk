import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints'

export async function login(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const sharedData = SharedData.getInstance();

      if (!sharedData.clinicId) reject(new Error('You must set a clinic id'));
      if (!sharedData.patientUsername) reject(new Error('You must set a username for login in sharedData class'));
      if (!sharedData.patientPassword) reject(new Error('SDK must set a password for login in sharedData class, throught patient model in normalize model process'));

      const credentials = {
        username: sharedData.patientUsername,
        password: sharedData.patientPassword,
        clinic: sharedData.clinicId
      };

      setTimeout(async () => {
        let _req: any;

        if (sharedData.mode === 'SDK_ALONE') {
          const _request = new ClientRequest('SDK');
          _req = await _request.post(endpoints.access.integrations, {});
        } else {
          // obtención token login token
          const _request = new ClientRequest('ATRYS');
          _req = await _request.post(endpoints.access.login, { ...credentials });

          // validación token para obtener access token
          const tokenRequest = new ClientRequest('ATRYS');
          const validateToken = await tokenRequest.post(endpoints.access.validate, {
            loginToken: _req.data.payload.loginToken
          })

          const accessToken = validateToken.data.payload.accessToken
          sharedData.tokens.accessToken = accessToken;

          sharedData.patientId = _req.data.payload.id;
        }

        if (_req.data.message && _req.data.message === 'Las credenciales ingresadas son incorrectas o no existen') {
          reject(new Error(_req.data.message))
        }

        if (_req.data.httpCode && _req.data.httpCode === 400) {
          reject(new Error(_req.data.message))
        }

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
