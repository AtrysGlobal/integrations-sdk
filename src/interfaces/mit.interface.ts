import { SessionInterface } from './session.interface';
import { IAvailability } from './availability.inteface'

export interface MitInterface {
  // session(setup: string, publicKey: string): Promise<SessionInterface>;
  // normalizeModel(clientPatientModel: any): Promise<any>;
  // createPatient(clientPatientModel: any): Promise<any>;
  // login(): Promise<any>;
  // listMedicalSpecialties(): Promise<any>;
  // listSpecialtiesByMedicalSpecialtyId(specialtyId: string): Promise<any>;
  // listProfessionalsBySpecialtyId(specialtyId: string): Promise<any>;
  // listBlocks(queryBlock: any): Promise<any>;
  // reserve(reservePayload: any): Promise<any>;
  // consolidate(symptoms: string[]): Promise<any>;
  // magicLink(): string;
  // getSymptoms(): Promise<any>;
  // getObjetives(): Promise<any>;
  // listProfessionals(): Promise<any>;
  // getAvailabilities(professionalId: string): Promise<any>;
  // createAvailability(availability: IAvailability, professionalId: string): Promise<any>;
  // updateAvailability(availability: IAvailability, availabilityId: string): Promise<any>;
  availability: {
    create: (availability: IAvailability, professionalId: string) => Promise<any>;
    update: (availability: IAvailability, availabilityId: string, professionalId: string) => Promise<any>;
    list: (professionalId: string) => Promise<any>;
    objetives: () => Promise<any>;
    enable: (availabilityId: string) => Promise<any>;
    disable: (availabilityId: string) => Promise<any>;
  };
  appointment: {
    reserve: (reservePayload: any) => Promise<any>;
    consolidate: (symptoms: string[]) => Promise<any>;
    symptoms: () => Promise<any>;
    byExternalId: () => Promise<any>;
  };
  common: {
    session: () => Promise<SessionInterface>;
    normalize: (clientPatientModel: any) => Promise<any>;
    ssoLink: () => string;
  };
  patient: {
    create: (clientPatientModel: any) => Promise<any>;
    login: () => Promise<any>;
    resetCredentials: (patientModel: any) => Promise<any>
  };
  specialties: {
    list: () => Promise<any>;
    byId: (specialtyId: string) => Promise<any>;
  };
  professionals: {
    bySpecialtyId: (specialtyId: string) => Promise<any>;
    blocks: (queryBlock: any) => Promise<any>;
    list: () => Promise<any>;
  }
}
