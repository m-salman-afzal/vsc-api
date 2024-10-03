export interface IShiftCountLogEntity {
    shiftCountLogId: string;
    receiverName: string;
    receiverSignature: string;
    cartName: string;
    handOffName: string;
    handOffSignature: string;
    createdAt: string;
    comment: string;
    cartId: string;
    facilityId: string;
    isDiscrepancy: boolean;
}

export interface ShiftCountLogEntity extends IShiftCountLogEntity {}

export class ShiftCountLogEntity {
    constructor(body: IShiftCountLogEntity) {
        this.shiftCountLogId = body.shiftCountLogId;
        this.createdAt = body.createdAt;
        this.comment = body.comment;
        this.handOffName = body.handOffName;
        this.handOffSignature = body.handOffSignature;
        this.receiverName = body.receiverName;
        this.receiverSignature = body.receiverSignature;
        this.cartName = body.cartName;
        this.cartId = body.cartId;
        this.facilityId = body.facilityId;
        this.isDiscrepancy = body.isDiscrepancy;
    }

    static create(body: unknown) {
        return new ShiftCountLogEntity(body as IShiftCountLogEntity);
    }
}
