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

  /* The Configuration class is used to store the configuration of the application */
  export class Configuration {
    /**
     * @param {string} stage - This is the stage of the application. It can be either "dev" or "prod".
     * @param {string} setup - This is the setup that you want to use. You can find the setup name in
     * the URL of the setup page.
     * @param {string} clinicId - The clinic ID of the clinic you want to use.
     * @param {string} locale - This is the language expected to be returned, 'es_ES', 'es_CL', es_CO', 'pr_BR'
     * @param {string} mode - This is the mode of the application. It can be either 'dev' or 'prod'.
     */
    constructor(public stage: string, public setup: string, public clinicId: string, public mode: string, public locale: string) {
      this.stage = stage;
      this.setup = setup;
      this.clinicId = clinicId
      this.mode = mode;
      this.locale = locale
    }
  }

  /* It's a class that holds the public key of the account you want to use to sign the transaction */
  export class Credentials {
    protected _publicKey: string = '';

    /**
     * @param {string} publicKey - The public key of the account you want to use to sign the
     * transaction.
     */
    constructor(publicKey: string) {
      this._publicKey = publicKey
    }

    /**
     * It returns the public key.
     * @returns The public key of the wallet.
     */
    public get publicKey(): string {
      return this._publicKey
    }
  }

  export abstract class SDK implements MitInterface {
    protected sharedData: SharedData;

    /**
     * The constructor function is used to initialize the sharedData object with the values from the
     * configuration object
     * @param {Configuration} config - Configuration - This is the configuration object that is passed
     * to the constructor of the base class.
     * @param {Credentials} credentials - Credentials - This is the object that contains the user's
     * credentials.
     */
    constructor(protected config: Configuration, protected credentials: Credentials) {
      this.sharedData = SharedData.getInstance();
      this.sharedData.mode = this.config.mode;
      this.sharedData.stage = this.config.stage;
      this.sharedData.setup = this.config.setup;
      this.sharedData.clinicId = this.config.clinicId;
      this.sharedData.locale = this.config.locale;
    }


    /**
     * > This function is used to get a session token from the MIT server
     * @returns The token is being returned.
     */
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

    /**
     * > This function takes a clientPatientModel object and returns a normalized clientPatientModel
     * object
     * @param {any} clientPatientModel - This is the patient model that you will be sending to the MIT
     * Rule Engine.
     * @returns The response from the server.
     */
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

    /**
     * It creates a patient
     * @param {any} patientModel - This is the patient model that you want to create.
     * @returns the result of the Patient.register function.
     */
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

    /**
     * It updates the patient profile
     * @param {any} patientModel - This is the model that you want to update.
     * @param {string} patientId - The id of the patient you want to update
     * @returns The patient profile is being returned.
     */
    protected updatePatientProfile = async (patientModel: any, userId: string): Promise<any> => {
      try {
        const req: any = await Patient.updatePatientProfile(patientModel, userId);

        return req;
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It logs in the user.
     * @returns The user's credentials.
     */
    protected login = async (): Promise<any> => {
      try {
        return await Auth.login()
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It resets the password of a patient.
     * @param {any} patientModel - This is the patient model that is passed to the function.
     * @returns a promise that resolves to the result of the changePassword function.
     */
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

    /**
     * It returns a list of medical specialties
     * @returns A list of medical specialties
     */
    protected listMedicalSpecialties = async (): Promise<any> => {
      try {
        return await MedicalSpecialties.list();
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It returns a list of specialties by medical specialty id
     * @param {string} specialtyId - string
     * @returns A list of specialties by medical specialty id
     */
    protected listSpecialtiesByMedicalSpecialtyId = async (specialtyId: string): Promise<any> => {
      try {
        return await Specialty.listById(specialtyId);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It returns a list of professionals by specialty id
     * @param {string} specialtyId - string
     * @returns A list of professionals
     */
    protected listProfessionalsBySpecialtyId = async (specialtyId: string): Promise<any> => {
      try {
        return await Professionals.listBySpecialty(specialtyId);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It returns a list of all the professionals in the database.
     * @returns A list of professionals
     */
    protected listProfessionals = async (): Promise<any> => {
      try {
        return await Professionals.list();
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It returns a list of blocks.
     * @param {any} queryBlock - The query block is a JSON object that contains the query parameters.
     * @returns A list of blocks
     */
    protected listBlocks = async (queryBlock: any): Promise<any> => {
      try {
        return await Blocks.list(queryBlock);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It returns a promise that resolves to an array of blocked days
     * @returns An array of blocked days
     */
    protected getBlockedDays = async (): Promise<any> => {
      try {
        return await Blocks.blockedDays();
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It reserves an appointment for a patient.
     * @param {AppointmentType} appointmentType - This is the type of appointment you want to reserve.
     * @param {any} dateDetails - {
     * @param {any} patientDetails - {
     * @returns The return value is a promise that resolves to an object with the following properties:
     */
    protected reserve = async (appointmentType: AppointmentType, dateDetails: any = {}, patientDetails: any = {}): Promise<any> => {
      try {
        return await Appopintment.reserve(appointmentType, dateDetails, patientDetails);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It takes an array of strings, and returns a promise that resolves to an array of objects
     * @param {string[]} symptoms - string[]
     * @returns the consolidated data from the database.
     */
    protected consolidate = async (symptoms: string[]): Promise<any> => {
      try {
        return await Appopintment.consolidate(symptoms);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It returns a promise that resolves to the result of the `getSymptoms` function in the
     * `Appointment` class
     */
    protected getSymptoms = async (): Promise<any> => {
      try {
        return await Appopintment.getSymptoms();
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It returns a list of objectives.
     * @returns The list of objectives
     */
    protected getObjetives = async (): Promise<any> => {
      try {
        return await Availability.listObjectives()
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It returns a list of availabilities for a given professional
     * @param {string} professionalId - string
     * @returns An array of availabilities
     */
    protected getAvailabilities = async (professionalId: string): Promise<any> => {
      try {
        return await Availability.list(professionalId)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It creates an availability for a professional
     * @param {IAvailability} availability - IAvailability - This is the availability object that you
     * want to create.
     * @param {string} professionalId - The id of the professional that the availability is being
     * created for.
     * @returns The availability object
     */
    protected createAvailability = async (availability: IAvailability, professionalId: string): Promise<any> => {
      try {
        return await Availability.create(availability, professionalId)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It updates the availability of a professional
     * @param {IAvailability} availability - IAvailability - This is the availability object that you
     * want to update.
     * @param {string} availabilityId - The id of the availability you want to update
     * @param {string} professionalId - The id of the professional that the availability belongs to.
     * @returns The updated availability
     */
    protected updateAvailability = async (availability: IAvailability, availabilityId: string, professionalId: string): Promise<any> => {
      try {
        return await Availability.update(availability, availabilityId, professionalId)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It disables an availability
     * @param {string} availabilityId - The id of the availability you want to disable.
     * @returns The availability object
     */
    protected disableAvailability = async (availabilityId: string): Promise<any> => {
      try {
        return await Availability.toggle(availabilityId, false)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It enables an availability by toggling the availability's `isActive` property to `true`
     * @param {string} availabilityId - The id of the availability you want to enable.
     * @returns The availability object
     */
    protected enableAvailability = async (availabilityId: string): Promise<any> => {
      try {
        return await Availability.toggle(availabilityId, true)
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    /**
     * It takes the patient's username, password, and appointment ID, encrypts them, and returns a URL
     * that contains the encrypted data
     * @returns A string with the magic link
     */
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

    /**
     * It returns the appointment id by external id.
     */
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
      resetCredentials: this.resetCredentials,
      update: this.updatePatientProfile
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