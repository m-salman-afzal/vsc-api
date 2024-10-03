import type {IPerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

type TGetAllPerpetualInventoryDto = Pick<IPerpetualInventoryEntity, "facilityId" | "isArchived" | "cartId">;

export interface GetAllPerpetualInventoryDto extends TGetAllPerpetualInventoryDto {}

export class GetAllPerpetualInventoryDto {
    private constructor(body: TGetAllPerpetualInventoryDto) {
        this.facilityId = body.facilityId;
        this.isArchived = body.isArchived;
        this.cartId = body.cartId;
    }

    static create(body: unknown) {
        return new GetAllPerpetualInventoryDto(body as TGetAllPerpetualInventoryDto);
    }
}
