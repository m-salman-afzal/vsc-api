import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";
import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";

type TBulkAddNonControlledInventoryDto = Pick<IFormularyEntity, "isControlled" | "isFormulary"> &
    Partial<Pick<IInventoryEntity, "ndc" | "expirationDate" | "lotNo" | "manufacturer" | "quantity">> &
    Pick<IInventoryEntity, "formularyId" | "facilityId"> & {
        action: "add" | "edit" | "delete" | "replen";
        failedReason: string;
    } & {
        formularyAutoId: number;
        inventoryAutoId: number;
        drug: string;
    };

export interface BulkAddNonControlledInventoryDto extends TBulkAddNonControlledInventoryDto {}

export class BulkAddNonControlledInventoryDto {
    constructor(body: TBulkAddNonControlledInventoryDto) {
        this.formularyAutoId = body.formularyAutoId as number;
        this.facilityId = body.facilityId;
        this.inventoryAutoId = body.inventoryAutoId as number;
        this.isFormulary = body.isFormulary;
        this.ndc = body.ndc as string;
        this.manufacturer = body.manufacturer as string;
        this.lotNo = body.lotNo as string;
        this.expirationDate = body.expirationDate as string;
        this.quantity = body.quantity as number;
        this.action = body.action;
        this.drug = body.drug;
    }

    static create(body: unknown) {
        return new BulkAddNonControlledInventoryDto(body as TBulkAddNonControlledInventoryDto);
    }
}
