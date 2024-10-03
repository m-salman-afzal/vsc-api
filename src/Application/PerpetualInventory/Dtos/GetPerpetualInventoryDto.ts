import type {IPerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

type TGetPerpetualInventoryDto = Pick<
    IPerpetualInventoryEntity,
    "cartId" | "name" | "facilityId" | "controlledDrugId"
> & {text: string; isArchived: boolean};

export interface GetPerpetualInventoryDto extends TGetPerpetualInventoryDto {}

export class GetPerpetualInventoryDto {
    private constructor(body: TGetPerpetualInventoryDto) {
        this.cartId = body.cartId;
        this.name = body.text;
        this.facilityId = body.facilityId;
        this.controlledDrugId = body.controlledDrugId;
        this.isArchived = body.isArchived;
    }

    static create(body: unknown) {
        return new GetPerpetualInventoryDto(body as TGetPerpetualInventoryDto);
    }
}
