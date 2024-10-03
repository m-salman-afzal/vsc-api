import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";

type TUpdateFormularyDto = Pick<IFormularyEntity, "formularyId" | "id"> &
    Partial<
        Pick<
            IFormularyEntity,
            | "brandName"
            | "genericName"
            | "drugName"
            | "strengthUnit"
            | "formulation"
            | "release"
            | "package"
            | "isGeneric"
            | "drugClass"
            | "isActive"
            | "isControlled"
            | "isFormulary"
            | "unitsPkg"
        >
    >;

export interface UpdateFormularyDto extends TUpdateFormularyDto {}

export class UpdateFormularyDto {
    constructor(body: TUpdateFormularyDto) {
        this.id = body.id as number;
        this.formularyId = body.formularyId;
        this.brandName = body.brandName as string;
        this.genericName = body.genericName as string;
        this.drugName = body.drugName as string;
        this.strengthUnit = body.strengthUnit as string;
        this.formulation = body.formulation as string;
        this.release = body.release as string;
        this.package = body.package as string;
        this.isGeneric = body.isGeneric as boolean;
        this.drugClass = body.drugClass as string;
        this.isActive = body.isActive as boolean;
        this.isControlled = body.isControlled as boolean;
        this.isFormulary = body.isFormulary as boolean;
        this.unitsPkg = body.unitsPkg as number;
    }

    static create(body: unknown) {
        return new UpdateFormularyDto(body as TUpdateFormularyDto);
    }
}
