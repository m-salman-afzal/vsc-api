import SharedUtils from "@appUtils/SharedUtils";

export interface IPatientEntity {
    patientId: string;
    externalPatientId: string;
    jmsId: string;
    name: string;
    location: string;
    dob: string;
    gender: string;
    status: string;
    lastBookedDate: string;
    lastReleaseDate: string;
    facilityId: string;
    supplyDays?: number;
}

export interface PatientEntity extends IPatientEntity {}

export class PatientEntity {
    constructor(patientEntity: IPatientEntity) {
        this.patientId = patientEntity.patientId;
        this.externalPatientId = patientEntity.externalPatientId;
        this.jmsId = patientEntity.jmsId;
        this.name = patientEntity.name ? patientEntity.name.trim() : patientEntity.name;
        this.location = patientEntity.location ? patientEntity.location.trim() : patientEntity.location;
        this.dob = patientEntity.dob ? SharedUtils.setDateTime(patientEntity.dob).date : patientEntity.dob;
        this.gender = patientEntity.gender ? patientEntity.gender.trim() : patientEntity.gender;
        this.status = patientEntity.status ? patientEntity.status.trim() : patientEntity.status;
        this.lastBookedDate = patientEntity.lastBookedDate;
        this.lastReleaseDate = patientEntity.lastReleaseDate;
        this.facilityId = patientEntity.facilityId;
    }

    static create(patientEntity) {
        return new PatientEntity(patientEntity);
    }

    static publicFields(patientEntity) {
        if (patientEntity.lastBookedDate) {
            const lastBookedDateTime = SharedUtils.setDateTime(patientEntity.lastBookedDate);
            patientEntity.lastBookedDate = `${lastBookedDateTime.date} ${lastBookedDateTime.time}`;
        }

        if (patientEntity.lastReleaseDate) {
            const lastReleaseDateTime = SharedUtils.setDateTime(patientEntity.lastReleaseDate);
            patientEntity.lastReleaseDate = `${lastReleaseDateTime.date} ${lastReleaseDateTime.time}`;
        }

        return new PatientEntity(patientEntity);
    }
}
