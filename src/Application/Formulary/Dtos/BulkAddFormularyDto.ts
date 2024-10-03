import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";

type TBulkAddFormularyDto = IFormularyEntity & {
    action: "add" | "edit" | "delete";
    failedReason: string;
    formularyAutoId: number;
};

export interface BulkAddFormularyDto extends TBulkAddFormularyDto {}

export class BulkAddFormularyDto {
    constructor(body: TBulkAddFormularyDto) {
        this.id = body.formularyAutoId as number;
        this.drugName = body.drugName as string;
        this.genericName = body.genericName as string;
        this.strengthUnit = body.strengthUnit as string;
        this.formulation = body.formulation as string;
        this.brandName = body.brandName as string;
        this.isGeneric = body.isGeneric as boolean;
        this.release = body.release as string;
        this.package = body.package as string;
        this.unitsPkg = body.unitsPkg as number;
        this.drugClass = body.drugClass as string;
        this.isActive = body.isActive as boolean;
        this.isControlled = body.isControlled as boolean;
        this.isFormulary = body.isFormulary as boolean;
        this.action = body.action;
    }

    static create(body: unknown) {
        return new BulkAddFormularyDto(body as TBulkAddFormularyDto);
    }
}
