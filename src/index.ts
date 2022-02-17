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
import { MitError } from './handlers/mit-error';

export class MIT implements MitInterface {
  private setup: string = '';
  protected publicKey: string = '';
  protected sharedData: SharedData;

  constructor(setup: string, publicKey: string, mode: string) {
    this.setup = setup;
    this.publicKey = publicKey;
    this.sharedData = SharedData.getInstance();
    this.sharedData.mode = mode;
    this.sharedData.setup = setup;
  }

  public async session(): Promise<SessionInterface> {
    const _request = new ClientRequest('MIT_SESSION');

    const publicKey = this.publicKey
    const setup = this.setup

    const _req = await _request.post('', { publicKey, setup });
    this.sharedData.tokens.mit = _req.data.token;

    return {
      token: this.sharedData.tokens.mit,
      environment: {
        frontend: _request.environments(this.setup, 'frontend'),
        backend: _request.environments(this.setup, 'backend'),
      },
    };
  }

  public async normalizeModel(clientPatientModel: any): Promise<any> {
    try {
      const _request = new ClientRequest('MIT_RULE_ENGINE');

      clientPatientModel.setup = this.sharedData.setup;

      const _req = await _request.post('', clientPatientModel);

      this.sharedData.patientPassword = _req.data.password;
      this.sharedData.patientUsername = _req.data.personalData.email;
      this.sharedData.integrationExternalId = _req.data.externalId;

      return _req;

    } catch (error: any) {
      throw new MitError(error);
    }
  }

  public async createPatient(patientModel: any): Promise<any> {
    try {
      const req: any = await Patient.register(patientModel);

      if (req.data.responseType === 'error' && req.data.httpCode === 422) {
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

  public async reserveSheduledAppointment(reservePayload: any): Promise<any> {
    try {
      return await Appopintment.reserveSheduled(reservePayload);
    } catch (error: any) {
      throw new MitError(error)
    }
  }

  public async consolidateSheduledAppointment(symptoms: string[]): Promise<any> {
    try {
      return await Appopintment.consolidateSheduled(symptoms);
    } catch (error: any) {
      throw new MitError(error)
    }
  }

  public async reserveInmediateAppointment(): Promise<any> {
    try {
      return await Appopintment.reserveInmediate();
    } catch (error: any) {
      throw new MitError(error)
    }
  }

  public async consolidateInmediateAppointment(symptoms: string[]): Promise<any> {
    try {
      return await Appopintment.consolidateInmediate(symptoms);
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

  public async getAppointmentIdByExternalId(): Promise<any>{
    try {
      return await Appopintment.getAppointmentIdByExternalId();
    } catch (error: any) {
      throw new MitError(error)
    }
  }
}

export default MIT;
