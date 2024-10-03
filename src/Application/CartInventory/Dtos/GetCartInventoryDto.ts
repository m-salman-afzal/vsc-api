type TGetCartInventoryDto = {
    cartId: string;
    facilityId: string;
    name?: string;
    text?: string;
};

export interface GetCartInventoryDto extends TGetCartInventoryDto {}

export class GetCartInventoryDto {
    private constructor(body: TGetCartInventoryDto) {
        this.cartId = body.cartId;
        this.facilityId = body.facilityId;
        this.name = body.text as string;
    }

    static create(body: unknown) {
        return new GetCartInventoryDto(body as TGetCartInventoryDto);
    }
}
