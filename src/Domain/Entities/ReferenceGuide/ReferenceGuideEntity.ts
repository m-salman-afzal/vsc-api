export interface IReferenceGuideEntity {
    referenceGuideId: string;
    facilityId: string;
    name: string;
    note: string;
}

export interface ReferenceGuideEntity extends IReferenceGuideEntity {}

export class ReferenceGuideEntity {
    constructor(referenceGuideEntity: IReferenceGuideEntity) {
        this.referenceGuideId = referenceGuideEntity.referenceGuideId;
        this.facilityId = referenceGuideEntity.facilityId;
        this.name = referenceGuideEntity.name ? referenceGuideEntity.name.trim() : referenceGuideEntity.name;
        this.note = referenceGuideEntity.note ? referenceGuideEntity.note.trim() : referenceGuideEntity.note;
    }

    static create(referenceGuideEntity) {
        return new ReferenceGuideEntity(referenceGuideEntity);
    }
}
