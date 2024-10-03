import SharedUtils from "@appUtils/SharedUtils";

export interface IInventoryHistoryEntity {
    inventoryHistoryId: string;
    facilityId: string;
    createdAt?: string;
}

export interface InventoryHistoryEntity extends IInventoryHistoryEntity {}

export class InventoryHistoryEntity {
    constructor(body: IInventoryHistoryEntity) {
        this.inventoryHistoryId = body.inventoryHistoryId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new InventoryHistoryEntity(body as IInventoryHistoryEntity);
    }

    static publicFields(body: unknown) {
        const entity = new InventoryHistoryEntity(body as IInventoryHistoryEntity);
        const {date, time} = SharedUtils.setDateTime((body as IInventoryHistoryEntity).createdAt as string);
        entity.createdAt = `${date} ${time}`;

        return entity;
    }
}
