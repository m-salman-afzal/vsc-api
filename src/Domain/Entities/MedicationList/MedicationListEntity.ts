export interface IMedicationListEntity {
    medicationListId: string;
    filename: string;
}

export interface MedicationListEntity extends IMedicationListEntity {}

export class MedicationListEntity {
    constructor(MedicationListEntity: IMedicationListEntity) {
        this.medicationListId = MedicationListEntity.medicationListId;
        this.filename = MedicationListEntity.filename
            ? MedicationListEntity.filename.trim()
            : MedicationListEntity.filename;
    }

    static create(medicationListEntity) {
        return new MedicationListEntity(medicationListEntity);
    }
}
