export interface TCartInventoryLogsDrugEntity {
    cartInventoryLogsDrugId: string;
    cartInventoryLogsId: string;
    controlledId: string;
    quantity: number;
    facilityId: string;
    name: string;
    tr: string;
    rx: string;
    quantityAllocated: number;
    isPatientSpecific: boolean;
}

export interface CartInventoryLogsDrugEntity extends TCartInventoryLogsDrugEntity {}

export class CartInventoryLogsDrugEntity {
    constructor(body: TCartInventoryLogsDrugEntity) {
        this.cartInventoryLogsId = body.cartInventoryLogsId;
        this.controlledId = body.controlledId;
        this.quantity = body.quantityAllocated;
        this.facilityId = body.facilityId;
        this.name = body.name;
        this.tr = body.isPatientSpecific ? body.rx : body.tr;
        this.rx = body.rx;
    }

    static create(body: unknown) {
        return new CartInventoryLogsDrugEntity(body as TCartInventoryLogsDrugEntity);
    }
}
