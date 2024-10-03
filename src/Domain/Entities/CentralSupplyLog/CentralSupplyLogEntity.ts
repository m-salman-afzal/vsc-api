import SharedUtils from "@appUtils/SharedUtils";

export interface ICentralSupplyLogEntity {
    centralSupplyLogId: string;
    orderedQuantity: number;
    adminId: string;
    facilityId: string;
    createdAt?: string;
}

export interface CentralSupplyLogEntity extends ICentralSupplyLogEntity {}

export class CentralSupplyLogEntity {
    constructor(body: ICentralSupplyLogEntity) {
        this.centralSupplyLogId = body.centralSupplyLogId;
        this.orderedQuantity = body.orderedQuantity;
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new CentralSupplyLogEntity(body as ICentralSupplyLogEntity);
    }

    static publicFields(body: unknown) {
        const entity = new CentralSupplyLogEntity(body as ICentralSupplyLogEntity);
        const {date, time} = SharedUtils.setDateTime((body as ICentralSupplyLogEntity).createdAt as string);
        entity.createdAt = `${date} ${time}`;

        return entity;
    }
}
