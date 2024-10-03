import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";

type TRemoveFormularyDto = Partial<Pick<IFormularyEntity, "formularyId" | "id">>;

export interface RemoveFormularyDto extends TRemoveFormularyDto {}

export class RemoveFormularyDto {
    constructor(body: TRemoveFormularyDto) {
        this.formularyId = body.formularyId as string;
        this.id = body.id as number;
    }

    static create(body: unknown) {
        return new RemoveFormularyDto(body as TRemoveFormularyDto);
    }
}
