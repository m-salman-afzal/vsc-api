import type {ICentralSupplyLogDrugEntity} from "@entities/CentralSupplyLogDrug/CentralSupplyLogDrugEntity";

type TAddCentralSupplyLogDrugDto = Omit<ICentralSupplyLogDrugEntity, "centralSupplyLogDrugId">;

export interface AddCentralSupplyLogDrugDto extends TAddCentralSupplyLogDrugDto {}

export class AddCentralSupplyLogDrugDto {
    private constructor(body: TAddCentralSupplyLogDrugDto) {
        this.centralSupplyLogId = body.centralSupplyLogId;
        this.formularyId = body.formularyId;
        this.orderedQuantity = body.orderedQuantity;
        this.formularyQuantity = body.formularyQuantity;
    }

    static create(body: unknown) {
        return new AddCentralSupplyLogDrugDto(body as TAddCentralSupplyLogDrugDto);
    }
}
