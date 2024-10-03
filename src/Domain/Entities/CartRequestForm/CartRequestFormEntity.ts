export interface ICartRequestFormEntity {
    cartRequestFormId: string;
    cartId: string;
    referenceGuideDrugId: string;
    facilityId: string;
}

export interface CartRequestFormEntity extends ICartRequestFormEntity {}

export class CartRequestFormEntity {
    constructor(body: ICartRequestFormEntity) {
        this.cartRequestFormId = body.cartRequestFormId;
        this.cartId = body.cartId;
        this.referenceGuideDrugId = body.referenceGuideDrugId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new CartRequestFormEntity(body as ICartRequestFormEntity);
    }
}
