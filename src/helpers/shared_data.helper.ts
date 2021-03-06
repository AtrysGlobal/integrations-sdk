import { Environment } from '../interfaces/environment.interface';
import { SessionTokens } from '../interfaces/session_tokens.interface';
import { IErrors} from '../interfaces/errors.interface';

export class SharedData {
  private static _instance: SharedData = new SharedData();

  public environment: Environment = {
    frontend: '',
    backend: '',
  };

  public tokens: SessionTokens = {
    mit: '',
    atrysBackend: '',
    atrysFrontEnd: '',
  };

  public patientId: string = '';
  public patientUsername: string = '';
  public patientPassword: string = '';
  public appopintmentReservedId: string = '';
  public mode: string = '';
  public integrationClientIdentificator: string = '';
  public integrationExternalId: string = '';
  public setup: string = '';
  public errors:IErrors[] = [];

  constructor() {
    if (SharedData._instance) {
      throw new Error('Error: Instantiation failed: Use SharedData.getInstance() instead of new.');
    }

    SharedData._instance = this;
  }

  public static getInstance(): SharedData {
    return SharedData._instance;
  }
}
