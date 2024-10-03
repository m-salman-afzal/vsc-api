export interface IShiftCountLogDrugEntity {
    rowNumber: number;
    controlledId: string;
    tr: string;
    rx: string;
    name: string;
    countedQuantity: number;
    quantityOnHand: number;
    shiftCountLogDrugId: string;
    shiftCountLogId: string;
}

export interface ShiftCountLogDrugEntity extends IShiftCountLogDrugEntity {}

export class ShiftCountLogDrugEntity {
    constructor(body: IShiftCountLogDrugEntity) {
        this.shiftCountLogDrugId = body.shiftCountLogDrugId;
        this.countedQuantity = body.countedQuantity;
        this.quantityOnHand = body.quantityOnHand;
        this.shiftCountLogId = body.shiftCountLogId;
        this.rx = body.rx;
        this.tr = body.tr;
        this.rowNumber = body.rowNumber;
        this.controlledId = body.controlledId;
        this.name = body.name;
    }

    static create(body: unknown) {
        return new ShiftCountLogDrugEntity(body as IShiftCountLogDrugEntity);
    }
}
