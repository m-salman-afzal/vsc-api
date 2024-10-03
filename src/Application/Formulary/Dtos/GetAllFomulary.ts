import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";

type TGetAllFormularyDto = Partial<IFormularyEntity>;

export interface GetAllFormularyDto extends TGetAllFormularyDto {}

export class GetAllFormularyDto {
    constructor(body: TGetAllFormularyDto) {
        this.isControlled = (body.isControlled ? body.isControlled === ("true" as never) : null) as boolean;
    }

    static create(body: unknown) {
        return new GetAllFormularyDto(body as TGetAllFormularyDto);
    }
}
