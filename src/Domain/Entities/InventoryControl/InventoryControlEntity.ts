export interface IInventoryControlEntity {
    inventoryControlId: string;
    receiverName: string;
    receiverSignature: string;
    witnessName: string;
    witnessSignature: string;
    inventoryId: string;
    facilityId: string;
}

export interface InventoryControlEntity extends IInventoryControlEntity {}

export class InventoryControlEntity {
    constructor(inventoryControlEntity: IInventoryControlEntity) {
        this.inventoryControlId = inventoryControlEntity.inventoryControlId;
        this.receiverName = inventoryControlEntity.receiverName
            ? inventoryControlEntity.receiverName.trim()
            : inventoryControlEntity.receiverName;
        this.receiverSignature = inventoryControlEntity.receiverSignature;
        this.witnessName = inventoryControlEntity.witnessName
            ? inventoryControlEntity.witnessName.trim()
            : inventoryControlEntity.witnessName;
        this.witnessSignature = inventoryControlEntity.witnessSignature;
        this.inventoryId = inventoryControlEntity.inventoryId;
        this.facilityId = inventoryControlEntity.facilityId;
    }

    static create(inventoryControlEntity: unknown) {
        return new InventoryControlEntity(inventoryControlEntity as IInventoryControlEntity);
    }
}
