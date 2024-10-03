type TGetReferenceGuideDto = {
    facilityId: string;
};

export interface GetReferenceGuideDto extends TGetReferenceGuideDto {}

export class GetReferenceGuideDto {
    constructor(body: TGetReferenceGuideDto) {
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new GetReferenceGuideDto(body as TGetReferenceGuideDto);
    }
}
