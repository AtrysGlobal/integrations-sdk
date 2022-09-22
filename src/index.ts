import { ClientRequest } from './helpers/request.helper';
import { SharedData } from './helpers/shared_data.helper';
import { Crypto } from './helpers/crypto.helper';
import { MitInterface } from './interfaces/mit.interface';
import { SessionInterface } from './interfaces/session.interface';
import { AppointmentType } from './enum/appointment.enum';
import * as Auth from './helpers/auth.helper';
import * as Specialty from './entities/specialty';
import * as Appopintment from './entities/appointment';
import * as Patient from './entities/patient';
import * as Professionals from './entities/professional';
import * as Blocks from './entities/blocks';
import * as Clinic from './entities/clinic';
import * as MedicalSpecialties from './entities/medical-specialties';
import * as Availability from './entities/availability';
import { IAvailability } from './interfaces/availability.inteface'

import { MitError } from './handlers/mit-error';

namespace MIT {

  export class Configuration {
    constructor(public stage: string, public setup: string, public clinicId: string, public mode: string) {
      this.stage = stage;
      this.setup = setup;
      this.clinicId = clinicId
      this.mode = mode;
    }
  }

  export class Credentials {
    protected _publicKey: string = '';

    constructor(publicKey: string) {
      this._publicKey = publicKey
    }

    public get publicKey(): string {
      return this._publicKey
    }
  }

  export abstract class SDK implements MitInterface {
    protected sharedData: SharedData;

    constructor(protected config: Configuration, protected credentials: Credentials) {
      this.sharedData = SharedData.getInstance();
      this.sharedData.mode = this.config.mode;
      this.sharedData.stage = this.config.stage;
      this.sharedData.setup = this.config.setup;
      this.sharedData.clinicId = this.config.clinicId;
    }

    protected session = async (): Promise<SessionInterface> => {
      const _request = new ClientRequest('MIT_SESSION');
      const publicKey = this.credentials.publicKey
      const stage = this.sharedData.stage
      const clinicId = this.sharedData.clinicId

      const _req = await _request.post('', { publicKey, setup: stage, clinicId });
      this.sharedData.tokens.mit = _req.data.token;

      const getClinicBaseUrl = await Clinic.getBaseUrl()
      this.sharedData.environment.frontend = getClinicBaseUrl

      return {
        token: this.sharedData.tokens.mit
      };
    }

    protected normalizeModel = async (clientPatientModel: any): Promise<any> => {
      try {
        const _request = new ClientRequest('MIT_RULE_ENGINE');

        clientPatientModel.setup = this.sharedData.stage;

        const _req = await _request.post('', clientPatientModel);

        this.sharedData.patientPassword = _req.data.password;
        this.sharedData.patientUsername = _req.data.personalData.email;

        if (!_req.data.hasOwnProperty('externalId')) {
          this.sharedData.integrationExternalId = Date.now().toString();
        } else {
          this.sharedData.integrationExternalId = _req.data.externalId;
        }

        return _req;

      } catch (error: any) {
        throw new MitError(error);
      }
    }

    protected createPatient = async (patientModel: any): Promise<any> => {
      try {
        const req: any = await Patient.register(patientModel);

        if (req.data.statusCode === 422) {
          return this.resetCredentials(patientModel);
        }

        return req;
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected login = async (): Promise<any> => {
      try {
        return await Auth.login()
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected resetCredentials = async (patientModel: any): Promise<any> => {
      try {
        return await Patient.changePassword({
          email: patientModel.personalData.email,
          password: patientModel.password,
        });
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected listMedicalSpecialties = async (): Promise<any> => {
      try {
        return await MedicalSpecialties.list();
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected listSpecialtiesByMedicalSpecialtyId = async (specialtyId: string): Promise<any> => {
      try {
        return await Specialty.listById(specialtyId);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected listProfessionalsBySpecialtyId = async (specialtyId: string): Promise<any> => {
      try {
        return await Professionals.listBySpecialty(specialtyId);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected listProfessionals = async (): Promise<any> => {
      try {
        return await Professionals.list();
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected listBlocks = async (queryBlock: any): Promise<any> => {
      try {
        return await Blocks.list(queryBlock);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected reserve = async (appointmentType: AppointmentType, dateDetails: any = {}, patientDetails: any = {}): Promise<any> => {
      try {
        return await Appopintment.reserve(appointmentType, dateDetails, patientDetails);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected consolidate = async (symptoms: string[]): Promise<any> => {
      try {
        return await Appopintment.consolidate(symptoms);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected getSymptoms = async (): Promise<any> => {
      try {
        return await Appopintment.getSymptoms();
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected getObjetives = async (): Promise<any> => {
      try {
        return await Availability.listObjectives()
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected getAvailabilities = async (professionalId: string): Promise<any> => {
      try {
        return await Availability.list(professionalId)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    // { "administrativeDetails": 
    //     { 
    //         "objective": "6213e19cc2a6c02a6ac79328", 
    //         "appointmentDuration": 10 
    //     }, 
    //     "professionalDetails": { 
    //         "specialtyId": "6213e196c2a6c02a6ac792b1" 
    //     }, 
    //     "dateDetails": { 
    //         "startDate": { 
    //             "year": 2022, 
    //             "month": 9, 
    //             "day": 20 
    //         }, 
    //         "endDate": { 
    //             "year": 2023, 
    //             "month": 9, 
    //             "day": 7 
    //         }, 
    //         "days": ["lunes", "martes", "miercoles", "jueves", "viernes"], 
    //         "dailyRanges": [{ "start": "09:00", "end": "19:00" }] 
    //     } 
    // }

    protected createAvailability = async (availability: IAvailability, professionalId: string): Promise<any> => {
      try {
        return await Availability.create(availability, professionalId)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    // { "administrativeDetails": { 
    //     "objective": "6213e19cc2a6c02a6ac79328", 
    //     "appointmentDuration": 10 
    //   }, 
    //  "professionalDetails": 
    //   { 
    //     "specialtyId": "6213e196c2a6c02a6ac792b1" 
    //   }, 
    //   "dateDetails": { 
    //     "startDate": { 
    //       "day": 20, 
    //       "month": 9, 
    //       "year": 2022 
    //     }, 
    //     "endDate": { 
    //       "day": 30, 
    //       "month": 11, 
    //       "year": 2022 
    //     }, 
    //     "days": ["sabado", "domingo"], 
    //     "dailyRanges": [{ "start": "17:00", "end": "18:00" }] 
    //   } 
    // }

    protected updateAvailability = async (availability: IAvailability, availabilityId: string, professionalId: string): Promise<any> => {
      try {
        return await Availability.update(availability, availabilityId, professionalId)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected disableAvailability = async (availabilityId: string): Promise<any> => {
      try {
        return await Availability.toggle(availabilityId, false)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected enableAvailability = async (availabilityId: string): Promise<any> => {
      try {
        return await Availability.toggle(availabilityId, true)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    protected getBlockedDays = async (): Promise<any> => {

    }

    protected magicLink = (): string => {
      const crypto = new Crypto();

      // DEPRECATED para compatibilidad con .NET
      // const patientData = {
      //   email: this.sharedData.patientUsername,
      //   password: this.sharedData.patientPassword,
      //   appointmentId: this.sharedData.appopintmentReservedId,
      // };
      // const dataEncrypted = crypto.encrypt(patientData);

      const dataEncrypted = crypto.base64Encode(
        `${this.sharedData.patientUsername};${this.sharedData.patientPassword};${this.sharedData.appopintmentReservedId};integration`
      )

      return this.sharedData.environment.frontend + '/integration-client?token=' + encodeURIComponent(dataEncrypted);
    }

    protected getAppointmentIdByExternalId = async (): Promise<any> => {
      try {
        return await Appopintment.getAppointmentIdByExternalId();
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    public patient = {
      create: this.createPatient,
      login: this.login,
      resetCredentials: this.resetCredentials
    }

    public appointment = {
      reserve: this.reserve,
      consolidate: this.consolidate,
      symptoms: this.getSymptoms,
      byExternalId: this.getAppointmentIdByExternalId
    }

    public specialty = {
      list: this.listMedicalSpecialties,
      byId: this.listSpecialtiesByMedicalSpecialtyId
    }

    public common = {
      session: this.session,
      normalize: this.normalizeModel,
      ssoLink: this.magicLink
    }

    public professionals = {
      bySpecialtyId: this.listProfessionalsBySpecialtyId,
      blocks: this.listBlocks,
      list: this.listProfessionals
    }

    public availability = {
      update: this.updateAvailability,
      create: this.createAvailability,
      list: this.getAvailabilities,
      objetives: this.getObjetives,
      disable: this.disableAvailability,
      enable: this.enableAvailability
    }
  }
}

export default MIT;