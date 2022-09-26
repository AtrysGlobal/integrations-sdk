import { SessionInterface } from './session.interface';
import { IAvailability } from './availability.inteface'
import { AppointmentType } from '../enum/appointment.enum';

export interface MitInterface {
  availability: {
    create: (availability: IAvailability, professionalId: string) => Promise<any>;
    update: (availability: IAvailability, availabilityId: string, professionalId: string) => Promise<any>;
    list: (professionalId: string) => Promise<any>;
    objetives: () => Promise<any>;
    enable: (availabilityId: string) => Promise<any>;
    disable: (availabilityId: string) => Promise<any>;
  };
  appointment: {
    reserve: (appointmentType: AppointmentType, dateDetails: any, patientDetails: any) => Promise<any>;
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
    update: (patientModel: any, userId: string) => Promise<any>
  };
  specialty: {
    list: () => Promise<any>;
    byId: (specialtyId: string) => Promise<any>;
  };
  professionals: {
    bySpecialtyId: (specialtyId: string) => Promise<any>;
    blocks: (queryBlock: any) => Promise<any>;
    list: () => Promise<any>;
  }
}
