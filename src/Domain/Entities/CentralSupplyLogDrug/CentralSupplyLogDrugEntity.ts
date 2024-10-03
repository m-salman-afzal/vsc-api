export interface ICentralSupplyLogDrugEntity {
    centralSupplyLogDrugId: string;
    orderedQuantity: number;
    formularyQuantity: number;
    centralSupplyLogId: string;
    formularyId: string;
    previousOrderedQuantity?: number;
}

export interface CentralSupplyLogDrugEntity extends ICentralSupplyLogDrugEntity {}

export class CentralSupplyLogDrugEntity {
    constructor(body: ICentralSupplyLogDrugEntity) {
        this.centralSupplyLogDrugId = body.centralSupplyLogDrugId;
        this.orderedQuantity = body.orderedQuantity;
        this.formularyQuantity = body.formularyQuantity;
        this.centralSupplyLogId = body.centralSupplyLogId;
        this.formularyId = body.formularyId;
    }

    static create(body: unknown) {
        return new CentralSupplyLogDrugEntity(body as ICentralSupplyLogDrugEntity);
    }

    static toCsv(body: unknown) {
        const entity = new CentralSupplyLogDrugEntity(body as ICentralSupplyLogDrugEntity);
        entity.previousOrderedQuantity = entity.orderedQuantity;

        return entity;
    }
}
