import type {IFormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";

type TAddFormularyLevelDto = Omit<IFormularyLevelEntity, "formularyLevelId" | "orderedQuantity">;

export interface AddFormularyLevelDto extends TAddFormularyLevelDto {}

export class AddFormularyLevelDto {
    constructor(body: TAddFormularyLevelDto) {
        this.facilityId = body.facilityId;
        this.formularyId = body.formularyId;
        this.min = body.min;
        this.max = body.max;
        this.threshold = body.threshold;
        this.parLevel = body.parLevel;
        this.isStock = body.isStock;
    }

    static create(body: unknown) {
        return new AddFormularyLevelDto(body as TAddFormularyLevelDto);
    }
}
