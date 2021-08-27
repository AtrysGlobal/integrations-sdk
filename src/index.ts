import config from './config';
import { ClientRequest } from './helpers/request.helper';
import { SharedData } from './helpers/shared_data.helper';
import { Crypto } from './helpers/crypto.helper';
import { MitInterface } from './interfaces/mit.interface';
import { SessionInterface } from './interfaces/session.interface';

import * as Auth from './helpers/auth.helper';
import * as Specialty from './entities/specialty';
import appointment, * as Appopintment from './entities/appointment';
import * as Patient from './entities/patient';
import * as Professionals from './entities/professional';
import * as Blocks from './entities/blocks';

export class MIT implements MitInterface {
  private setup: string = '';
  protected publicKey: string = '';
  protected sharedData: SharedData;

  constructor(setup: string, publicKey: string, mode: string) {
    this.setup = setup;
    this.publicKey = publicKey;
    this.sharedData = SharedData.getInstance();
    this.sharedData.mode = mode;
  }

  public async session(setup: string): Promise<SessionInterface> {
    const _request = new ClientRequest('MIT_SESSION');

    const _req = await _request.post('', { publicKey: this.publicKey });
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
    const _request = new ClientRequest('MIT_RULE_ENGINE');

    const _req = await _request.post('', clientPatientModel);

    this.sharedData.patientPassword = _req.data.password;
    this.sharedData.patientUsername = _req.data.personalData.email;

    return _req;
  }

  public async createPatient(patientModel: any): Promise<any> {
    try {
      const req: any = await Patient.register(patientModel);

      if (req.data.responseType === 'error' && req.data.httpCode === 422) {
        const reset = await this.resetCredentials(patientModel);
        return reset;
      }

      return req;
    } catch (error) {
      return error;
    }
  }

  public async login(): Promise<any> {
    try {
      return await Auth.login();
    } catch (error) {
      return error;
    }
  }

  private async resetCredentials(patientModel: any): Promise<any> {
    try {
      return await Patient.changePassword({
        email: patientModel.personalData.email,
        password: patientModel.password,
      });
    } catch (error) {
      return error;
    }
  }

  public async listProfessionals(): Promise<any> {
    try {
      return await Professionals.list();
    } catch (error) {
      return error;
    }
  }

  public async listSpecialties(specialtyId: string): Promise<any> {
    try {
      return await Specialty.list(specialtyId);
    } catch (error) {
      return error;
    }
  }

  public async listBlocks(queryBlock: any): Promise<any> {
    try {
      return await Blocks.list(queryBlock);
    } catch (error) {
      return error;
    }
  }

  public async reserveSheduledAppointment(reservePayload: any): Promise<any> {
    try {
      return await Appopintment.reserveSheduled(reservePayload);
    } catch (error) {
      return error;
    }
  }

  public async consolidateSheduledAppointment(symptoms: string[]): Promise<any> {
    try {
      return await Appopintment.consolidateSheduled(symptoms);
    } catch (error) {
      return error;
    }
  }

  public async reserveInmediateAppointment(): Promise<any> {
    try {
      return await Appopintment.reserveInmediate();
    } catch (error) {
      return error;
    }
  }

  public async consolidateInmediateAppointment(symptoms: string[]): Promise<any> {
    try {
      return await Appopintment.consolidateInmediate(symptoms);
    } catch (error) {
      return error;
    }
  }

  public magicLink(): string {
    const crypto = new Crypto();

    const patientData = {
      email: this.sharedData.patientUsername,
      password: this.sharedData.patientPassword,
      appointmentId: this.sharedData.appopintmentReservedId,
    };

    const dataEncrypted = crypto.encrypt(patientData);
    const magicLink = this.sharedData.environment.frontend + '/integration-client?token=' + dataEncrypted;

    return magicLink;
  }
}

export default MIT;
