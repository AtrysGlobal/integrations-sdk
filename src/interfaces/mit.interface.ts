import { SessionInterface } from './session.interface';

export interface MitInterface {
  session(setup: string, publicKey: string): Promise<SessionInterface>;
  normalizeModel(clientPatientModel: any): Promise<any>;
  createPatient(clientPatientModel: any): Promise<any>;
  login(): Promise<any>;
  listMedicalSpecialties(): Promise<any>;
  listSpecialtiesByMedicalSpecialtyId(specialtyId: string): Promise<any>;
  listProfessionalsBySpecialtyId(specialtyId: string): Promise<any>;
  listBlocks(queryBlock: any): Promise<any>;
  reserve(reservePayload: any): Promise<any>;
  consolidate(symptoms: string[]): Promise<any>;
  magicLink(): string;
}
