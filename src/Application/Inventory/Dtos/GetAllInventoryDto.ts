import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";

type TGetAllInventoryDto = Partial<Pick<IInventoryEntity, "facilityId">> & {
    pastExpiry: boolean;
    isControlled?: boolean;
};

export interface GetAllInventoryDto extends TGetAllInventoryDto {}

export class GetAllInventoryDto {
    constructor(body: TGetAllInventoryDto) {
        this.facilityId = body.facilityId as string;
        this.pastExpiry = body.pastExpiry as boolean;
        this.isControlled = (body.isControlled ? body.isControlled === ("true" as never) : null) as boolean;
    }

    static create(body: unknown) {
        return new GetAllInventoryDto(body as TGetAllInventoryDto);
    }
}
