import type {IControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";

type TBulkAddControlledInventoryDto = Partial<
    Pick<IInventoryEntity, "ndc" | "expirationDate" | "lotNo" | "manufacturer">
> &
    Pick<IInventoryEntity, "formularyId" | "facilityId"> &
    Partial<Pick<IControlledDrugEntity, "controlledId">> & {
        action: "add" | "edit" | "delete" | "replen";
        failedReason: string;
    } & Partial<Omit<IControlledDrugEntity, "controlledDrugId">> & {
        formularyAutoId: number;
        inventoryAutoId: number;
        controlledDrugAutoId: number;
        drug: string;
    };

export interface BulkAddControlledInventoryDto extends TBulkAddControlledInventoryDto {}

export class BulkAddControlledInventoryDto {
    constructor(body: TBulkAddControlledInventoryDto) {
        this.formularyAutoId = body.formularyAutoId as number;
        this.facilityId = body.facilityId;
        this.inventoryAutoId = body.inventoryAutoId as number;
        this.ndc = body.ndc as string;
        this.manufacturer = body.manufacturer as string;
        this.lotNo = body.lotNo as string;
        this.expirationDate = body.expirationDate as string;
        this.controlledDrugAutoId = body.controlledDrugAutoId as number;
        this.controlledId = body.controlledId as string;
        this.tr = body.tr as string;
        this.controlledQuantity = body.controlledQuantity as number;
        this.action = body.action;
        this.drug = body.drug;
    }

    static create(body: unknown) {
        return new BulkAddControlledInventoryDto(body as TBulkAddControlledInventoryDto);
    }
}
