type TGetCartDto = {
    cart: string;
    facilityId: string;
    referenceGuideId: string;
};

export interface GetCartDto extends TGetCartDto {}

export class GetCartDto {
    constructor(body: TGetCartDto) {
        this.cart = body.cart;
        this.facilityId = body.facilityId;
        this.referenceGuideId = body.referenceGuideId;
    }

    static create(body: unknown) {
        return new GetCartDto(body as TGetCartDto);
    }
}
