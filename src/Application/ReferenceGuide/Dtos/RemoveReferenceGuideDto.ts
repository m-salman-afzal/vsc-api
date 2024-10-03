type TRemoveReferenceGuideDto = {
    referenceGuideId: string;
    facilityId: string;
};

export interface RemoveReferenceGuideDto extends TRemoveReferenceGuideDto {}

export class RemoveReferenceGuideDto {
    constructor(body: TRemoveReferenceGuideDto) {
        this.referenceGuideId = body.referenceGuideId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new RemoveReferenceGuideDto(body as TRemoveReferenceGuideDto);
    }
}
