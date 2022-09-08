import { ClientRequest } from './helpers/request.helper';
import { SharedData } from './helpers/shared_data.helper';
import { Crypto } from './helpers/crypto.helper';
import { MitInterface } from './interfaces/mit.interface';
import { SessionInterface } from './interfaces/session.interface';

import * as Auth from './helpers/auth.helper';
import * as Specialty from './entities/specialty';
import * as Appopintment from './entities/appointment';
import * as Patient from './entities/patient';
import * as Professionals from './entities/professional';
import * as Blocks from './entities/blocks';
import * as Clinic from './entities/clinic';

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

  export class SDK implements MitInterface {
    protected sharedData: SharedData;
    public mode: string = '';

    constructor(config: Configuration, private credentials: Credentials) {
      this.sharedData = SharedData.getInstance();
      this.sharedData.mode = config.mode;
      this.sharedData.stage = config.stage;
      this.sharedData.setup = config.setup;
      this.sharedData.clinicId = config.clinicId;
    }

    public async session(): Promise<SessionInterface> {
      const _request = new ClientRequest('MIT_SESSION');

      const publicKey = this.credentials.publicKey
      const stage = this.sharedData.stage

      const _req = await _request.post('', { publicKey, setup: stage });
      this.sharedData.tokens.mit = _req.data.token;

      const getClinicBaseUrl = await Clinic.getBaseUrl()
      this.sharedData.environment.frontend = getClinicBaseUrl

      return {
        token: this.sharedData.tokens.mit
      };
    }

    public async normalizeModel(clientPatientModel: any): Promise<any> {
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

    public async createPatient(patientModel: any): Promise<any> {
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

    public async login(): Promise<any> {
      try {
        return await Auth.login()
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    private async resetCredentials(patientModel: any): Promise<any> {
      try {
        return await Patient.changePassword({
          email: patientModel.personalData.email,
          password: patientModel.password,
        });
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    public async listProfessionals(): Promise<any> {
      try {
        return await Professionals.list();
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    public async listSpecialties(specialtyId: string): Promise<any> {
      try {
        return await Specialty.list(specialtyId);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    public async listBlocks(queryBlock: any): Promise<any> {
      try {
        return await Blocks.list(queryBlock);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    public async reserve(reservePayload: any): Promise<any> {
      try {
        return await Appopintment.reserve(reservePayload);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    public async consolidate(symptoms: string[]): Promise<any> {
      try {
        return await Appopintment.consolidate(symptoms);
      } catch (error: any) {
        throw new MitError(error)
      }
    }

    public magicLink(): string {
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

    public async getAppointmentIdByExternalId(): Promise<any> {
      try {
        return await Appopintment.getAppointmentIdByExternalId();
      } catch (error: any) {
        throw new MitError(error)
      }
    }
  }
}

export default MIT;