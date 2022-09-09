import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints'
import { AppointmentType } from '../enum/appointment.enum';

const sharedData = SharedData.getInstance();

export const consolidate = async (symptoms: string[]): Promise<object> => {
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

    const _req = await _request.post(endpoints.appointments.consolidate, { ...payload });

    if (_req.data.message !== 'OK') {
      throw new MitError(_req.data.message);
    }

    return _req;
  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.APPOINTMENTS);
  }
}

export async function reserve(appointmentType: AppointmentType, dateDetails: any = {}, patientDetails: any = {}): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');

    if (!sharedData.integrationClientIdentificator) throw new MitError('The integrationClientIdentificator property is mandatory, must set in sharedData')

    const obj = {
      integrationClientIdentificator: sharedData.integrationClientIdentificator,
      integrationExternalId: sharedData.integrationExternalId,
      dateDetails,
      appointmentType,
      patientDetails
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

export async function getAppointmentIdByExternalId(): Promise<object> {
  try {
    const externalId = sharedData.integrationExternalId

    if (!externalId) throw new MitError('The externalId argument is mandatory')

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get(`${endpoints.integrations.list}/${externalId}`);

    return _req.data.payload;

  } catch (error: any) {
    throw new MitError(error, ERROR_TYPES.APPOINTMENTS);
  }
}

export default { reserve, consolidate, getAppointmentIdByExternalId };
