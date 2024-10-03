type TRemoveReferenceGuideDrugDto = {
    referenceGuideDrugId: string;
    referenceGuideId: string;
    formularyId: string;
};

export interface RemoveReferenceGuideDrugDto extends TRemoveReferenceGuideDrugDto {}

export class RemoveReferenceGuideDrugDto {
    constructor(body: TRemoveReferenceGuideDrugDto) {
        this.referenceGuideDrugId = body.referenceGuideDrugId;
        this.formularyId = body.formularyId;
        this.referenceGuideId = body.referenceGuideId;
    }

    static create(body: unknown) {
        return new RemoveReferenceGuideDrugDto(body as TRemoveReferenceGuideDrugDto);
    }
}
