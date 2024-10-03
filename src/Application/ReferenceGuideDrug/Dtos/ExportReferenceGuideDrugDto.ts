type TExportReferenceGuideDrugDto = {
    referenceGuideId: string;
    facilityId: string;
};

export interface ExportReferenceGuideDrugDto extends TExportReferenceGuideDrugDto {}

export class ExportReferenceGuideDrugDto {
    constructor(body: TExportReferenceGuideDrugDto) {
        this.referenceGuideId = body.referenceGuideId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new ExportReferenceGuideDrugDto(body as TExportReferenceGuideDrugDto);
    }
}
