type TAddReferenceGuideDto = {
    name: string;
    facilityId: string;
};

export interface AddReferenceGuideDto extends TAddReferenceGuideDto {}

export class AddReferenceGuideDto {
    constructor(body: TAddReferenceGuideDto) {
        this.name = body.name;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new AddReferenceGuideDto(body as TAddReferenceGuideDto);
    }
}
