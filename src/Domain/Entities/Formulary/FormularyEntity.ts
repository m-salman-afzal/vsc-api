import SharedUtils from "@appUtils/SharedUtils";

import type {InventoryEntity} from "@entities/Inventory/InventoryEntity";

export interface IFormularyEntity {
    formularyId: string;
    drugName: string;
    brandName: string;
    genericName: string;
    drugClass: string;
    strengthUnit: string;
    package: string;
    unitsPkg: number;
    release: string;
    formulation: string;
    isGeneric: boolean;
    isControlled: boolean;
    isFormulary: boolean;
    isActive: boolean;
    name: string;

    id?: number;
    inventory?: InventoryEntity[];
    formularyAutoId?: number;
}

export interface FormularyEntity extends IFormularyEntity {}

export class FormularyEntity {
    constructor(body: IFormularyEntity) {
        this.formularyId = body.formularyId;
        this.drugName = body.drugName ? body.drugName.trim() : body.drugName;
        this.brandName = body.brandName ? body.brandName.trim() : body.brandName;
        this.genericName = body.genericName ? body.genericName.trim() : body.genericName;
        this.drugClass = body.drugClass ? body.drugClass.trim() : body.drugClass;
        this.strengthUnit = body.strengthUnit ? body.strengthUnit.trim() : body.strengthUnit;
        this.package = body.package ? body.package.trim() : body.package;
        this.unitsPkg = body.unitsPkg;
        this.release = body.release ? body.release.trim() : body.release;
        this.formulation = body.formulation ? body.formulation.trim() : body.formulation;
        this.isGeneric = body.isGeneric;
        this.isControlled = body.isControlled;
        this.isFormulary = body.isFormulary;

        this.isActive = body.isActive;
        this.name = body.name ? body.name.trim() : body.name;
    }

    static create(body: unknown) {
        return new FormularyEntity(body as IFormularyEntity);
    }

    static publicFields(body: unknown) {
        const formulary = new FormularyEntity(body as IFormularyEntity);
        formulary.id = (body as IFormularyEntity).id as number;
        formulary.formularyAutoId = formulary.id;

        return formulary;
    }

    static toCsv(body: unknown) {
        const formulary = new FormularyEntity(body as IFormularyEntity);
        formulary.id = (body as IFormularyEntity).id as number;
        formulary.formularyAutoId = formulary.id;

        const afterBooleanConversion = SharedUtils.convertBooleanToNumber(structuredClone(formulary), [
            "isActive",
            "isGeneric",
            "isControlled",
            "isFormulary"
        ]);

        const formularyCsv = SharedUtils.convertNullToEmptyString(
            afterBooleanConversion as unknown as Record<string, unknown>
        );

        return formularyCsv;
    }
}
