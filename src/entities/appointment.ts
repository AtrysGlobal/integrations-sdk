import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';

const sharedData = SharedData.getInstance();

export async function reserveInmediate(): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');
    const _req = await _request.post('/appointments/immediate/', {});

    if(_req.data.message !== 'OK') throw new Error('Inmediate appointments must be 30 mins apart')
    if (_req.data) sharedData.appopintmentReservedId = _req.data.payload._id;

    return _req;
  } catch (error) {
    return error;
  }
}

export async function consolidateInmediate(symptoms: string[]): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');

    if (!sharedData.appopintmentReservedId)
      return new Error(
        'For consolidate a new appointment you must provide an appointment id, throught reserve method, or define in sharedData class',
      );

    const payload = {
      id: sharedData.appopintmentReservedId,
      patientDetails: { symptoms },
    };

    const _req = await _request.post('/appointments/immediate/consolidate/', { ...payload });
    return _req;
  } catch (error) {
    return error;
  }
}

export async function reserveSheduled(reservePayload: any): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');
    const _req = await _request.post('/appointments/reserve/', { ...reservePayload });

    if (_req.data) sharedData.appopintmentReservedId = _req.data.payload.id;

    return _req;
  } catch (error) {
    return error;
  }
}

export async function consolidateSheduled(symptoms: string[]): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');

    if (!sharedData.appopintmentReservedId)
      return new Error(
        'For consolidate a new appointment you must provide an appointment id, throught reserve method, or define in sharedData class',
      );

    const payload = {
      id: sharedData.appopintmentReservedId,
      patientDetails: { symptoms },
    };

    const _req = await _request.post('/appointments/consolidate/', { ...payload });
    return _req;
  } catch (error) {
    return error;
  }
}

export default { reserveInmediate, consolidateInmediate, reserveSheduled, consolidateSheduled };
