export interface IControlledDrugEntity {
    controlledDrugId: string;
    controlledId: string;
    controlledType: string;
    tr: string;
    rx: string;
    patientName: string;
    controlledQuantity: number;
    inventoryId: string;
    cartId: string;
    providerName: string;
}

export interface ControlledDrugEntity extends IControlledDrugEntity {}

export class ControlledDrugEntity {
    constructor(body: IControlledDrugEntity) {
        this.controlledDrugId = body.controlledDrugId;
        this.controlledId = body.controlledId;
        this.controlledType = body.controlledType;
        this.controlledQuantity = body.controlledQuantity;
        this.inventoryId = body.inventoryId;
        this.cartId = body.cartId;
        this.tr = body.tr ? body.tr.trim() : body.tr;
        this.rx = body.rx ? body.rx.trim() : body.rx;
        this.patientName = body.patientName ? body.patientName.trim() : body.patientName;
        this.providerName = body.providerName ? body.providerName.trim() : body.providerName;
    }

    static create(body: unknown) {
        return new ControlledDrugEntity(body as IControlledDrugEntity);
    }
}
