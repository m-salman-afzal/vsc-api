type TGetCartsDto = {
    facilityId: string;
};

export interface GetCartsDto extends TGetCartsDto {}

export class GetCartsDto {
    private constructor(body: TGetCartsDto) {
        this.facilityId = body.facilityId;
    }
    static create(body: unknown) {
        return new GetCartsDto(body as TGetCartsDto);
    }
}
