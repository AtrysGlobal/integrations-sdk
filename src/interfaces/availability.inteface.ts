
type AdministrativeDetails = {
    clinicId: string;
    objective?: string;
    appointmentDuration: number;
    isActive: boolean;
};

type DateUnformatted = {
    year: number | string;
    month: number | string;
    day: number | string;
};

type ProfessionalDetails = {
    userId?: string;
    specialtyId?: string;
};

type DailyRange = {
    start: string;
    end: string;
};

interface IAvailabilityBase {
    administrativeDetails: AdministrativeDetails;
    dateDetails: {
        startDate?: Date | DateUnformatted;
        endDate?: Date | DateUnformatted;
        days: string[];
        dailyRanges: DailyRange[];
    };
    professionalDetails: ProfessionalDetails;
}

/* Extending the interface IAvailabilityBase and adding the startDate and endDate properties to the
dateDetails object. */
export interface IAvailability extends IAvailabilityBase {
    dateDetails: {
        startDate: Date;
        endDate: Date;
    } & IAvailabilityBase['dateDetails'];
}

/* Extending the interface IAvailabilityBase and adding the startDate and endDate properties to the
dateDetails object. */
export interface IAvailabilityDocument extends IAvailabilityBase {
    professionalDetails: {
        userId: string;
    } & IAvailabilityBase['professionalDetails'];
    dateDetails: {
        startDate: Date;
        endDate: Date;
    } & IAvailabilityBase['dateDetails'];
    isDeleted: boolean;
}