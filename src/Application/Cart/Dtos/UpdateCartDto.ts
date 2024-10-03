type TUpdateCartDto = {
    cartId: string[];
    cart: string;
    units: string[];
    referenceGuideId: string;
};

export interface UpdateCartDto extends TUpdateCartDto {}

export class UpdateCartDto {
    constructor(body: TUpdateCartDto) {
        this.cart = body.cart;
        this.units = body.units;
        this.cartId = body.cartId;
        this.referenceGuideId = body.referenceGuideId;
    }

    static create(body: unknown) {
        return new UpdateCartDto(body as TUpdateCartDto);
    }
}
