import SharedUtils from "@appUtils/SharedUtils";

export interface ICartRequestDrugEntity {
    cartRequestDrugId: string;
    initialPendingOrderQuantity: number;
    packageQuantity: number;
    totalUnits: number;
    controlledId: string;
    tr: string;
    pickStatus: string;
    allocationStatus: string;
    fromPartial: boolean;
    cartRequestFormId: string;
    cartId: string;
    cartRequestLogId: string;
    referenceGuideDrugId: string;
    facilityId: string;
    formularyId: string;
    pickedByAdminId: string;
    allocatedByAdminId: string;
    pickedAt: string;
    allocatedAt: string;
    cartRequestAllocationLogId: string;
    cartRequestPickLogId: string;
    cartRequestDeletionLogId: string;
    createdAt?: string;
}

export interface CartRequestDrugEntity extends ICartRequestDrugEntity {}

export class CartRequestDrugEntity {
    constructor(body: ICartRequestDrugEntity) {
        this.cartRequestDrugId = body.cartRequestDrugId;
        this.initialPendingOrderQuantity = body.initialPendingOrderQuantity;
        this.packageQuantity = body.packageQuantity;
        this.totalUnits = body.totalUnits;
        this.controlledId = body.controlledId;
        this.pickStatus = body.pickStatus;
        this.allocationStatus = body.allocationStatus;
        this.fromPartial = body.fromPartial;
        this.cartRequestFormId = body.cartRequestFormId;
        this.cartId = body.cartId;
        this.cartRequestLogId = body.cartRequestLogId;
        this.referenceGuideDrugId = body.referenceGuideDrugId;
        this.facilityId = body.facilityId;
        this.formularyId = body.formularyId;
        this.pickedByAdminId = body.pickedByAdminId;
        this.allocatedByAdminId = body.allocatedByAdminId;
        this.pickedAt = body.pickedAt;
        this.allocatedAt = body.allocatedAt;
        this.cartRequestPickLogId = body.cartRequestPickLogId;
        this.cartRequestAllocationLogId = body.cartRequestAllocationLogId;
        this.cartRequestDeletionLogId = body.cartRequestDeletionLogId;
        this.tr = body.tr;
    }

    static create(body: unknown) {
        return new CartRequestDrugEntity(body as ICartRequestDrugEntity);
    }

    static publicFields(body: unknown) {
        const entity = new CartRequestDrugEntity(body as ICartRequestDrugEntity);
        const {date, time} = SharedUtils.setDateTime((body as ICartRequestDrugEntity).createdAt as string);
        entity.createdAt = `${date} ${time}`;

        return entity;
    }
}
