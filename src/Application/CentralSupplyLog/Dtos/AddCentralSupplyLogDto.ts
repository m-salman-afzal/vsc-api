import type {IFormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";

type TAddCentralSupplyLogDto = Pick<IFormularyLevelEntity, "facilityId"> & {
    rxOrder: {
        formularyId: string;
        orderedQuantity: number;
    }[];
};

export interface AddCentralSupplyLogDto extends TAddCentralSupplyLogDto {}

export class AddCentralSupplyLogDto {
    private constructor(body: TAddCentralSupplyLogDto) {
        this.facilityId = body.facilityId;
        this.rxOrder = body.rxOrder;
    }

    static create(body: unknown) {
        return new AddCentralSupplyLogDto(body as TAddCentralSupplyLogDto);
    }
}
