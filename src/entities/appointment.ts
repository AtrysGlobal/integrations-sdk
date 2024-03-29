import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints'
import { AppointmentType } from '../enum/appointment.enum';
import { RBAC } from '../helpers/rbac.helper';

const sharedData = SharedData.getInstance();

/**
 * It takes an array of strings as a parameter, and returns a promise that resolves to an object
 * @param {string[]} symptoms - string[]
 * @returns An object with the following structure:
 * {
 *   "data": {
 *     "message": "OK",
 *     "data": {
 *       "id": "5f5d8f8f8f8f8f8f8f8f8f8f",
 *       "patientDetails": {
 *         "symptoms": [
 *           "fever",
 */
export const consolidate = async (symptoms: string[]): Promise<object> => {
  try {
    RBAC(['SDK_PATIENT']);

    const _request = new ClientRequest('ATRYS');

    if (!sharedData.appopintmentReservedId)
      throw new MitError(
        'For consolidate a new appointment you must provide an appointment id, throught reserve method, or define in sharedData class',
      );

    const payload = {
      id: sharedData.appopintmentReservedId,
      patientDetails: { symptoms },
    };

    const _req = await _request.post(endpoints.appointments.consolidate, { ...payload });

    if (_req.data.message !== 'OK') {
      throw new MitError(_req.data.message);
    }

    return _req;
  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.APPOINTMENTS);
  }
}

/**
 * It reserves an appointment in the system
 * @param {AppointmentType} appointmentType - AppointmentType,
 * @param {any} dateDetails - {
 * @param {any} professionalDetails - {
 * @returns The appointment reserved id
 */
export async function reserve(appointmentType: AppointmentType, dateDetails: any = {}, professionalDetails: any = {}): Promise<object> {
  try {
    RBAC(['SDK_PATIENT']);

    const _request = new ClientRequest('ATRYS');

    if (!sharedData.integrationClientIdentificator) throw new MitError('The integrationClientIdentificator property is mandatory, must set in sharedData')

    const obj = {
      integrationClientIdentificator: sharedData.integrationClientIdentificator,
      integrationExternalId: sharedData.integrationExternalId,
      dateDetails,
      appointmentType,
      professionalDetails
    }

    const _req = await _request.post(endpoints.appointments.reserve, obj);
    if (_req.data.statusCode !== 201) {
      throw new MitError(_req.data.message);
    }

    if (_req.data) sharedData.appopintmentReservedId = _req.data.payload._id;

    return _req;
  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.APPOINTMENTS);
  }
}

/**
 * It gets the appointment id by the external id.
 * @returns The appointment id
 */
export async function getAppointmentIdByExternalId(): Promise<object> {
  try {
    RBAC(['SDK_PATIENT']);

    const externalId = sharedData.integrationExternalId

    if (!externalId) throw new MitError('The externalId argument is mandatory')

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get(`${endpoints.integrations.list}/${externalId}`);

    return _req.data.payload;

  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.APPOINTMENTS);
  }
}

/**
 * It makes a request to the API endpoint `/symptoms` and returns the response data
 * @returns An object with the symptoms
 */
export async function getSymptoms(): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get(endpoints.appointments.symptoms);

    return _req.data.payload;

  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.APPOINTMENTS);
  }
}


export default { reserve, consolidate, getAppointmentIdByExternalId };
