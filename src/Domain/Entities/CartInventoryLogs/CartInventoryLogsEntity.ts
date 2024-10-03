export interface TCartInventoryLogsEntity {
    cartInventoryLogsId: string;
    countedBy: string;
    witnessName: string;
    comment: string;
    witnessSignature: string;
    countedBySignature: string;
    facilityId: string;
    cart: string;
    createdAt: string;
}

export interface CartInventoryLogsEntity extends TCartInventoryLogsEntity {}

export class CartInventoryLogsEntity {
    constructor(body: TCartInventoryLogsEntity) {
        this.cartInventoryLogsId = body.cartInventoryLogsId;
        this.witnessName = body.witnessName;
        this.countedBy = body.countedBy;
        this.facilityId = body.facilityId;
        this.comment = body.comment;
        this.facilityId = body.facilityId;
        this.countedBySignature = body.countedBySignature;
        this.witnessSignature = body.witnessSignature;
        this.cart = body.cart;
        this.createdAt = body.createdAt;
    }

    static create(body: unknown) {
        return new CartInventoryLogsEntity(body as TCartInventoryLogsEntity);
    }
}
