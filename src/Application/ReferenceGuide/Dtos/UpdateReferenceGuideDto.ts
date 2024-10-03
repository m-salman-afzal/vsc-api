type TUpdateReferenceGuideDto = {
    referenceGuideId: string;
    facilityId: string;
    name: string;
};

export interface UpdateReferenceGuideDto extends TUpdateReferenceGuideDto {}

export class UpdateReferenceGuideDto {
    constructor(body: TUpdateReferenceGuideDto) {
        this.name = body.name;
        this.referenceGuideId = body.referenceGuideId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new UpdateReferenceGuideDto(body as TUpdateReferenceGuideDto);
    }
}
