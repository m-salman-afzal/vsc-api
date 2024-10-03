import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";

type TRemoveInventoryDto = Pick<IInventoryEntity, "inventoryId" | "facilityId">;

export interface RemoveInventoryDto extends TRemoveInventoryDto {}

export class RemoveInventoryDto {
    constructor(body: TRemoveInventoryDto) {
        this.inventoryId = body.inventoryId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new RemoveInventoryDto(body as TRemoveInventoryDto);
    }
}
