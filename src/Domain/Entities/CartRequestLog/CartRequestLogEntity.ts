import SharedUtils from "@appUtils/SharedUtils";

export interface ICartRequestLogEntity {
    cartRequestLogId: string;
    type: string;
    canUndo: boolean;
    controlledType: string;
    receiverName: string;
    receiverSignature: string;
    witnessName: string;
    witnessSignature: string;
    cartId: string;
    adminId: string;
    facilityId: string;
    createdAt?: string;
}

export interface CartRequestLogEntity extends ICartRequestLogEntity {}

export class CartRequestLogEntity {
    constructor(body: ICartRequestLogEntity) {
        this.cartRequestLogId = body.cartRequestLogId;
        this.type = body.type;
        this.canUndo = body.canUndo;
        this.controlledType = body.controlledType;
        this.receiverName = body.receiverName;
        this.receiverSignature = body.receiverSignature;
        this.witnessName = body.witnessName;
        this.witnessSignature = body.witnessSignature;
        this.cartId = body.cartId;
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new CartRequestLogEntity(body as ICartRequestLogEntity);
    }

    static publicFields(body: unknown) {
        const entity = new CartRequestLogEntity(body as ICartRequestLogEntity);
        const {date, time} = SharedUtils.setDateTime((body as ICartRequestLogEntity).createdAt as string);
        entity.createdAt = `${date} ${time}`;

        return entity;
    }
}
