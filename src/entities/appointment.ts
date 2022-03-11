import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { MitError } from '../handlers/mit-error';

const sharedData = SharedData.getInstance();

const consolidate = async (symptoms: string[], type: string) : Promise<object> => {
  let _endpoint: string = '';

  if(type === 'INMEDIATE'){
    _endpoint = '/appointments/immediate/consolidate/'
  }else{
    _endpoint = '/appointments/consolidate/'
  }

  try {
    const _request = new ClientRequest('ATRYS');

    if (!sharedData.appopintmentReservedId) 
      throw new MitError(
        'For consolidate a new appointment you must provide an appointment id, throught reserve method, or define in sharedData class',
      );

    const payload = {
      id: sharedData.appopintmentReservedId,
      patientDetails: { symptoms },
    };

    const _req = await _request.post(_endpoint, { ...payload });

    if (_req.data.message !== 'OK') {
      throw new MitError(_req.data.message);
    }

    return _req;
  } catch (error: any) {
    throw new MitError(error);
  }
}

export async function reserveInmediate(): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');

    if(!sharedData.integrationClientIdentificator) throw new MitError('The integrationClientIdentificator property is mandatory, must set in sharedData')

    const obj = {
      integrationClientIdentificator: sharedData.integrationClientIdentificator,
      integrationExternalId: sharedData.integrationExternalId
    }

    const _req = await _request.post('/appointments/immediate/', obj);
    if (_req.data.message !== 'OK') {
      throw new MitError(_req.data.message);
    }

    if (_req.data) sharedData.appopintmentReservedId = _req.data.payload._id;

    return _req;
  } catch (error: any) {
    throw new MitError(error);
  }
}

export async function consolidateInmediate(symptoms: string[]): Promise<object> {
  return consolidate(symptoms, 'INMEDIATE');
}

export async function reserveSheduled(reservePayload: any): Promise<object> {
  try {

    if(!sharedData.integrationClientIdentificator) throw new MitError('The integrationClientIdentificator property is mandatory, must set in sharedData')

    reservePayload.integrationClientIdentificator = sharedData.integrationClientIdentificator;
    reservePayload.integrationExternalId = sharedData.integrationExternalId;

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.post('/appointments/reserve/', { ...reservePayload });

    if (_req.data) {
      if (_req.data.message !== 'Resource created'){
        throw new MitError(_req.data.message);
      }

      sharedData.appopintmentReservedId = _req.data.payload.id;
    }

    return _req;
  } catch (error: any) {
    throw new MitError(error);
  }
}

export async function consolidateSheduled(symptoms: string[]): Promise<object> {
  return consolidate(symptoms, 'SCHEDULED');
}

export async function getAppointmentIdByExternalId(): Promise<object>{
  try {
    const externalId = sharedData.integrationExternalId

    if(!externalId) throw new MitError('The externalId argument is mandatory')

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get(`/integrations/appointments/inmediate/${externalId}`);

    return _req.data.payload;

  } catch (error: any) {
    throw new MitError(error);
  }
}

export default { reserveInmediate, consolidateInmediate, reserveSheduled, consolidateSheduled };
