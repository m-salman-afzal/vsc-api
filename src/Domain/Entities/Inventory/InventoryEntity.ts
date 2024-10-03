import SharedUtils from "@appUtils/SharedUtils";

export interface IInventoryEntity {
    inventoryId: string;
    ndc: string;
    manufacturer: string;
    isActive: boolean;
    lotNo: string;
    expirationDate: string;
    quantity: number;
    formularyId: string;
    facilityId: string;

    id?: number;
    totalQuantity?: number;
}

export interface InventoryEntity extends IInventoryEntity {}

export class InventoryEntity {
    constructor(body: IInventoryEntity) {
        this.inventoryId = body.inventoryId;
        this.ndc = body.ndc ? body.ndc.trim() : body.ndc;
        this.manufacturer = body.manufacturer ? body.manufacturer.trim() : body.manufacturer;
        this.isActive = body.isActive;
        this.lotNo = body.lotNo ? body.lotNo.trim() : body.lotNo;
        this.expirationDate = body.expirationDate ? SharedUtils.setDate(body.expirationDate) : body.expirationDate;
        this.quantity = body.quantity;
        this.formularyId = body.formularyId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new InventoryEntity(body as IInventoryEntity);
    }

    static publicFields(body: IInventoryEntity) {
        const inventory = new InventoryEntity(body);
        inventory.id = body.id as number;

        return inventory;
    }
}
