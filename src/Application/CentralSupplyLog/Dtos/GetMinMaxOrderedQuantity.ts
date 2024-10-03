type TGetMinMaxOrderedQuantityDto = {
    facilityId: string;
};

export interface GetMinMaxOrderedQuantityDto extends TGetMinMaxOrderedQuantityDto {}

export class GetMinMaxOrderedQuantityDto {
    private constructor(body: TGetMinMaxOrderedQuantityDto) {
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new GetMinMaxOrderedQuantityDto(body as TGetMinMaxOrderedQuantityDto);
    }
}
