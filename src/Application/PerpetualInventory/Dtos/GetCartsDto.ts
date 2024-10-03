type TGetCartsDto = {
    facilityId: string;
    isArchived: boolean;
};

export interface GetCartsDto extends TGetCartsDto {}

export class GetCartsDto {
    private constructor(body: TGetCartsDto) {
        this.facilityId = body.facilityId;
        this.isArchived = body.isArchived;
    }
    static create(body: unknown) {
        return new GetCartsDto(body as TGetCartsDto);
    }
}
