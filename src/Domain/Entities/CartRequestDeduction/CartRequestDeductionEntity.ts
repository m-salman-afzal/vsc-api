export interface ICartRequestDeductionEntity {
    cartRequestDeductionId: string;
    quantity: number;
    inventoryId: string;
    cartRequestDrugId: string;
    facilityId: string;
    controlledDrugId: string;
}

export interface CartRequestDeductionEntity extends ICartRequestDeductionEntity {}

export class CartRequestDeductionEntity {
    constructor(body: ICartRequestDeductionEntity) {
        this.cartRequestDeductionId = body.cartRequestDeductionId;
        this.quantity = body.quantity;
        this.inventoryId = body.inventoryId;
        this.cartRequestDrugId = body.cartRequestDrugId;
        this.facilityId = body.facilityId;
        this.controlledDrugId = body.controlledDrugId;
    }

    static create(body: unknown) {
        return new CartRequestDeductionEntity(body as ICartRequestDeductionEntity);
    }
}
