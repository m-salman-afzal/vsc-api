import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";

type TGetFormularyDto = Partial<
    Pick<IFormularyEntity, "isActive" | "formularyId" | "id" | "isControlled" | "isFormulary" | "name"> & {
        refillStock: boolean;
    }
>;

export interface GetFormularyDto extends TGetFormularyDto {}

export class GetFormularyDto {
    constructor(body: TGetFormularyDto) {
        const name = body.name?.trim() as string;

        this.formularyId = body.formularyId as string;
        this.name = name;
        this.id = name as unknown as number;
        this.isActive = (body.isActive ? body.isActive === ("true" as never) : null) as boolean;
        this.isControlled = (body.isControlled ? body.isControlled === ("true" as never) : null) as boolean;
        this.isFormulary = (body.isFormulary ? body.isFormulary === ("true" as never) : null) as boolean;
        this.refillStock = (body.refillStock ? body.refillStock === ("true" as never) : null) as boolean;
    }

    static create(body: unknown) {
        return new GetFormularyDto(body as TGetFormularyDto);
    }
}
