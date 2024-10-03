type TRemoveCartRequestDrugDto = {
    cartRequestDrugId: string[];
    facilityId: string;
};

export interface RemoveCartRequestDrugDto extends TRemoveCartRequestDrugDto {}

export class RemoveCartRequestDrugDto {
    private constructor(body: TRemoveCartRequestDrugDto) {
        this.cartRequestDrugId = body.cartRequestDrugId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new RemoveCartRequestDrugDto(body as TRemoveCartRequestDrugDto);
    }
}
