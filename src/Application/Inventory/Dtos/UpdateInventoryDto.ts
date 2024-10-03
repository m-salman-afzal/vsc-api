import type {IControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";

type TUpdateInventoryDto = Pick<IInventoryEntity, "inventoryId"> &
    Partial<
        Pick<
            IInventoryEntity,
            "ndc" | "manufacturer" | "formularyId" | "isActive" | "expirationDate" | "lotNo" | "quantity" | "facilityId"
        > &
            Pick<IControlledDrugEntity, "controlledId">
    >;

export interface UpdateInventoryDto extends TUpdateInventoryDto {}

export class UpdateInventoryDto {
    constructor(body: TUpdateInventoryDto) {
        this.inventoryId = body.inventoryId;
        this.ndc = body.ndc as string;
        this.manufacturer = body.manufacturer as string;
        this.formularyId = body.formularyId as string;
        this.isActive = body.isActive as boolean;
        this.controlledId = body.controlledId as string;
        this.expirationDate = body.expirationDate as string;
        this.lotNo = body.lotNo as string;
        this.quantity = body.quantity as number;
        this.facilityId = body.facilityId as string;
    }

    static create(body: unknown) {
        return new UpdateInventoryDto(body as TUpdateInventoryDto);
    }
}
