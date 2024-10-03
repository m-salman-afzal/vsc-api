import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";

type TRefillStockDto = Omit<Pick<IFormularyEntity, "formularyId">, "formularyId"> & {
    formularyId: string[];
};

interface RefillStockDto extends TRefillStockDto {}

class RefillStockDto {
    constructor(body: TRefillStockDto) {
        this.formularyId = body.formularyId;
    }

    static create(body: TRefillStockDto) {
        return new RefillStockDto(body);
    }
}

export default RefillStockDto;
