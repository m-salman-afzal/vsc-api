type TModifyReferenceGuideDto = {
    referenceGuideId: string;
    facilityId: string;
};

export interface ModifyReferenceGuideDto extends TModifyReferenceGuideDto {}

export class ModifyReferenceGuideDto {
    constructor(body: TModifyReferenceGuideDto) {
        this.referenceGuideId = body.referenceGuideId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new ModifyReferenceGuideDto(body as TModifyReferenceGuideDto);
    }
}
