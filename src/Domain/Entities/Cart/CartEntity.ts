export interface ICartEntity {
    cartId: string;
    cart: string;
    facilityId: string;
    referenceGuideId: string;
}

export interface CartEntity extends ICartEntity {}

export class CartEntity {
    constructor(cartEntity: ICartEntity) {
        this.cartId = cartEntity.cartId;
        this.cart = cartEntity.cart ? cartEntity.cart.trim() : cartEntity.cart;
        this.facilityId = cartEntity.facilityId;
        this.referenceGuideId = cartEntity.referenceGuideId;
    }

    static create(cartEntity) {
        return new CartEntity(cartEntity);
    }
}
