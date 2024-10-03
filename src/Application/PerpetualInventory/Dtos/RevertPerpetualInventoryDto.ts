type TRevertPerpetualInventoryDto = {
    cartRequestDeductionId: string;
};

export interface RevertPerpetualInventoryDto extends TRevertPerpetualInventoryDto {}

export class RevertPerpetualInventoryDto {
    private constructor(body: TRevertPerpetualInventoryDto) {
        this.cartRequestDeductionId = body.cartRequestDeductionId;
    }
    static create(body: unknown) {
        return new RevertPerpetualInventoryDto(body as TRevertPerpetualInventoryDto);
    }
}
