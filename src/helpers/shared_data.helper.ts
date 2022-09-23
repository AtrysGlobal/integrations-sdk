import { Environment } from '../interfaces/environment.interface';
import { SessionTokens } from '../interfaces/session_tokens.interface';
import { IErrors } from '../interfaces/errors.interface';

/* It's a singleton class that holds all the data that is shared between the different components */
export class SharedData {
  private static _instance: SharedData = new SharedData();

  public environment: Environment = {
    frontend: '',
    backend: '',
  };

  public tokens: SessionTokens = {
    mit: '',
    accessToken: '',
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
  public stage: string = '';
  public errors: IErrors[] = [];
  public clinicId: string = '';
  public loginToken: string = '';

  /**
   * If an instance of the class already exists, throw an error. Otherwise, create an instance of the
   * class
   */
  constructor() {
    if (SharedData._instance) {
      throw new Error('Error: Instantiation failed: Use SharedData.getInstance() instead of new.');
    }

    SharedData._instance = this;
  }

  /**
   * If the instance is null, create a new instance of SharedData and assign it to the instance
   * variable. 
   * 
   * If the instance is not null, return the instance variable. 
   * 
   * The first time this function is called, the instance variable will be null, so a new instance of
   * SharedData will be created and assigned to the instance variable. 
   * 
   * The second time this function is called, the instance variable will not be null, so the instance
   * variable will be returned. 
   * 
   * The instance variable will always be the same object, so the same data will be shared.
   * @returns The instance of the class.
   */
  public static getInstance(): SharedData {
    return SharedData._instance;
  }
}
