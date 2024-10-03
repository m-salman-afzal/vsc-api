import type {IPatientEntity} from "@entities/Patient/PatientEntity";

export interface IExternalPatient {
    SAPPHIRE_PAT_ID: string;
    JMS_ID: string;
    PATIENT_NAME: string;
    LOCATION: string;
    DOB: string | Date;
    GENDER: string;
    PAT_STATUS: string;
    LAST_BOOKED_DATE: string | Date;
    LAST_RELEASE_DATE: string;
    FACILITY_ID: string;
}

export interface PatientTransformer extends IPatientEntity {}

export class PatientTransformer {
    constructor(patientTransformer: IExternalPatient) {
        this.externalPatientId = patientTransformer.SAPPHIRE_PAT_ID;
        this.jmsId = patientTransformer.JMS_ID;
        this.name = patientTransformer.PATIENT_NAME;
        this.location = patientTransformer.LOCATION;
        this.dob = patientTransformer.DOB as string;
        this.gender = patientTransformer.GENDER;
        this.status = patientTransformer.PAT_STATUS;
        this.lastBookedDate = patientTransformer.LAST_BOOKED_DATE as string;
        this.lastReleaseDate = patientTransformer.LAST_RELEASE_DATE;
        this.facilityId = patientTransformer.FACILITY_ID;
    }

    static create(patientTransformer) {
        return new PatientTransformer(patientTransformer);
    }
}
