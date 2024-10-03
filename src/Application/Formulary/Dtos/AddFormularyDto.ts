import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";

type TAddFormularyDto = Pick<
    IFormularyEntity,
    "drugName" | "genericName" | "strengthUnit" | "formulation" | "isFormulary"
> &
    Partial<
        Pick<
            IFormularyEntity,
            "drugClass" | "brandName" | "package" | "unitsPkg" | "release" | "isGeneric" | "isControlled" | "isActive"
        >
    >;

export interface AddFormularyDto extends TAddFormularyDto {}

export class AddFormularyDto {
    constructor(body: TAddFormularyDto) {
        this.isFormulary = body.isFormulary;
        this.drugName = body.drugName;
        this.genericName = body.genericName;
        this.strengthUnit = body.strengthUnit;
        this.formulation = body.formulation;
        this.brandName = body.brandName as string;
        this.release = body.release as string;
        this.package = body.package as string;
        this.isGeneric = body.isGeneric as boolean;
        this.drugClass = body.drugClass as string;
        this.isActive = body.isActive as boolean;
        this.isControlled = body.isControlled as boolean;
        this.unitsPkg = body.unitsPkg as number;
    }

    static create(body: unknown) {
        return new AddFormularyDto(body as TAddFormularyDto);
    }
}
