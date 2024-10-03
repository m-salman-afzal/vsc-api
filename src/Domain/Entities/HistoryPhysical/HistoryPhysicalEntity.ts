import SharedUtils from "@appUtils/SharedUtils";

import type {IPatientEntity} from "@entities/Patient/PatientEntity";

export interface IHistoryPhysicalEntity {
    historyPhysicalId: string;
    sapphirePatientId: string;
    patientName: string;
    patientNumber: string;
    location: string;
    dob: string;
    age: number;
    annualDate?: string;
    initialDate?: string;
    lastBooked?: string;
    isYearly: boolean;
    facilityId: string;
    patientId: string;
    externalPatientId?: string;
}

export interface HistoryPhysicalEntity extends IHistoryPhysicalEntity {}

type BasePublicFields = Pick<
    IHistoryPhysicalEntity,
    "patientName" | "patientNumber" | "location" | "dob" | "age" | "patientId"
>;

interface AnnualHpFields extends BasePublicFields {
    annualDate: IHistoryPhysicalEntity["annualDate"];
}

interface InitialHpFields extends BasePublicFields {
    initialDate: IHistoryPhysicalEntity["initialDate"];
    lastBooked: IHistoryPhysicalEntity["lastBooked"];
}

export class HistoryPhysicalEntity {
    private constructor(fileEntity: IHistoryPhysicalEntity) {
        this.historyPhysicalId = fileEntity.historyPhysicalId;
        this.sapphirePatientId = fileEntity.sapphirePatientId;
        this.patientName = fileEntity.patientName;
        this.patientNumber = fileEntity.patientNumber;
        this.location = fileEntity.location;
        this.dob = fileEntity.dob ? SharedUtils.setDate(fileEntity.dob) : fileEntity.dob;
        this.age = fileEntity.age;
        this.annualDate = fileEntity.annualDate
            ? SharedUtils.setDate(fileEntity.annualDate)
            : (fileEntity.annualDate as string);
        this.initialDate = fileEntity.initialDate
            ? SharedUtils.setDate(fileEntity.initialDate)
            : (fileEntity.initialDate as string);
        this.lastBooked = fileEntity.lastBooked
            ? SharedUtils.setDate(fileEntity.lastBooked)
            : (fileEntity.lastBooked as string);
        this.isYearly = fileEntity.isYearly;
        this.facilityId = fileEntity.facilityId;
        this.patientId = fileEntity.patientId;
    }

    static create(fileEntity: IHistoryPhysicalEntity) {
        return new HistoryPhysicalEntity(fileEntity);
    }

    static publicFields(
        fileEntity: Readonly<IHistoryPhysicalEntity> & Readonly<IPatientEntity>
    ): AnnualHpFields | InitialHpFields {
        const {patientNumber, patientName, dob, location, age, patientId, name, jmsId} = fileEntity;

        const baseFields: BasePublicFields = {patientName, patientNumber, dob, location, age, patientId};

        if (fileEntity.isYearly) {
            return {
                ...baseFields,
                annualDate: fileEntity.annualDate ? SharedUtils.setDate(fileEntity.annualDate) : fileEntity.annualDate,
                patientName: name,
                patientNumber: jmsId
            };
        }

        return {
            ...baseFields,
            initialDate: fileEntity.initialDate ? SharedUtils.setDate(fileEntity.initialDate) : fileEntity.initialDate,
            lastBooked: fileEntity.lastBooked ? SharedUtils.setDate(fileEntity.lastBooked) : fileEntity.lastBooked,
            patientName: name,
            patientNumber: jmsId
        };
    }
}
