export interface ICartInventoryEntity {
    name: string;
    rowNumber: number;
    quantity: number;
    controlledId: string;
    tr: string;
    rx: string;
    qtyOh: number;
    isPatientSpecific: boolean;
}

export interface CartInventoryEntity extends ICartInventoryEntity {}

export class CartInventoryEntity {
    constructor(body: ICartInventoryEntity) {
        this.name = body.name;
        this.rowNumber = body.rowNumber;
        this.controlledId = body.controlledId;
        this.tr = body.tr;
        this.rx = body.rx;
        this.qtyOh = body.qtyOh;
        this.isPatientSpecific = body.isPatientSpecific;
    }

    static create(body: unknown) {
        return new CartInventoryEntity(body as ICartInventoryEntity);
    }
}
