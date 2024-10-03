import SharedUtils from "@appUtils/SharedUtils";

export interface IFormularyLevelEntity {
    formularyLevelId: string;
    min: number;
    max: number;
    parLevel: number;
    threshold: number;
    isStock: boolean;
    orderedQuantity: number;
    formularyId: string;
    facilityId: string;
}

export interface FormularyLevelEntity extends IFormularyLevelEntity {}

export class FormularyLevelEntity {
    constructor(body: IFormularyLevelEntity) {
        this.formularyLevelId = body.formularyLevelId;
        this.min = body.min;
        this.max = body.max;
        this.parLevel = body.parLevel;
        this.threshold = body.threshold;
        this.isStock = body.isStock;
        this.formularyId = body.formularyId;
        this.facilityId = body.facilityId;
        this.orderedQuantity = body.orderedQuantity;
    }

    static create(body: unknown) {
        return new FormularyLevelEntity(body as IFormularyLevelEntity);
    }

    static toCsv(body: unknown) {
        const entity = new FormularyLevelEntity(body as IFormularyLevelEntity);

        return SharedUtils.convertBooleanToNumber(structuredClone(entity), ["isStock"]);
    }
}
