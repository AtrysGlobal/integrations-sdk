import { SessionInterface } from './session.interface'

export interface MitInterface{
    session(setup: string, public_key: string): Promise<SessionInterface>
    normalizeModel(clientPatientModel: any): Promise<any>
    createPatient(clientPatientModel: any): Promise<any>
    login(): Promise<any>
    listProfessionals(): Promise<any>
    listSpecialties(specialtyId: string): Promise<any>
    listBlocks(queryBlock: any): Promise<any>
    reserveSheduledAppointment(reservePayload: any): Promise<any>
    consolidateSheduledAppointment(symptoms: Array<string>): Promise<any>
    reserveInmediateAppointment(): Promise<any>
    consolidateInmediateAppointment(symptoms: Array<string>): Promise<any>
}