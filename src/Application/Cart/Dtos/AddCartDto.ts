type TAddCartDto = {
    cart: string;
    facilityId: string;
    referenceGuideId: string;
    units: string[];
};

export interface AddCartDto extends TAddCartDto {}

export class AddCartDto {
    constructor(body: TAddCartDto) {
        this.cart = body.cart;
        this.units = body.units;
        this.facilityId = body.facilityId;
        this.referenceGuideId = body.referenceGuideId;
    }

    static create(body: unknown) {
        return new AddCartDto(body as TAddCartDto);
    }
}
