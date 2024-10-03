import SharedUtils from "@appUtils/SharedUtils";

export interface IDiscrepancyLogEntity {
    discrepancyLogId: string;
    type: string;
    level: number;
    comment: string;
    perpetualInventoryId: string;
    perpetualInventoryDeductionId: string;
    quantityDeducted: number;
    cartId: string;
    facilityId: string;
    adminId: string;
    expectedQuantity: number;
    createdAt?: string;
    handOffName: string;
    receiverName: string;
    quantityAllocated: number;
}

export interface DiscrepancyLogEntity extends IDiscrepancyLogEntity {}

export class DiscrepancyLogEntity {
    constructor(body: IDiscrepancyLogEntity) {
        this.discrepancyLogId = body.discrepancyLogId;
        this.type = body.type;
        this.level = body.level;
        this.comment = body.comment;
        this.quantityDeducted = body.quantityDeducted;
        this.cartId = body.cartId;
        this.perpetualInventoryId = body.perpetualInventoryId;
        this.perpetualInventoryDeductionId = body.perpetualInventoryDeductionId;
        this.facilityId = body.facilityId;
        this.adminId = body.adminId;
        this.expectedQuantity = body.expectedQuantity;
        this.handOffName = body.handOffName;
        this.receiverName = body.receiverName;
        this.quantityAllocated = body.quantityAllocated;
    }

    static create(body: unknown) {
        return new DiscrepancyLogEntity(body as IDiscrepancyLogEntity);
    }

    static publicFields(body: unknown) {
        const entity = DiscrepancyLogEntity.create(body);
        const {date, time} = SharedUtils.setDateTime((body as IDiscrepancyLogEntity).createdAt as string);
        entity.createdAt = `${date} ${time}`;

        return entity;
    }
}
