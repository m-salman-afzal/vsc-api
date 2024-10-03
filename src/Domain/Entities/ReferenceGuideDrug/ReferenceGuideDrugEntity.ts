export interface IReferenceGuideDrugEntity {
    referenceGuideDrugId: string;
    category: string;
    subCategory: string;
    min: number;
    max: number;
    notes: string;
    referenceGuideId: string;
    formularyId: string;

    id?: number;
}

export interface ReferenceGuideDrugEntity extends IReferenceGuideDrugEntity {}

export class ReferenceGuideDrugEntity {
    constructor(referenceGuideDrugEntity: IReferenceGuideDrugEntity) {
        this.referenceGuideDrugId = referenceGuideDrugEntity.referenceGuideDrugId;
        this.category = referenceGuideDrugEntity.category
            ? referenceGuideDrugEntity.category.trim()
            : (null as unknown as string);
        this.subCategory = referenceGuideDrugEntity.subCategory
            ? referenceGuideDrugEntity.subCategory.trim()
            : (null as unknown as string);
        this.min = referenceGuideDrugEntity.min;
        this.max = referenceGuideDrugEntity.max;
        this.notes = referenceGuideDrugEntity.notes
            ? referenceGuideDrugEntity.notes.trim()
            : (null as unknown as string);
        this.referenceGuideId = referenceGuideDrugEntity.referenceGuideId;
        this.formularyId = referenceGuideDrugEntity.formularyId;
    }

    static create(referenceGuideDrugEntity) {
        return new ReferenceGuideDrugEntity(referenceGuideDrugEntity);
    }
}
