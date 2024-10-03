import type {IPerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

type TUnarchivePerpetualInventoryDto = Pick<IPerpetualInventoryEntity, "perpetualInventoryId">;

export interface UnarchivePerpetualInventoryDto extends TUnarchivePerpetualInventoryDto {}

export class UnarchivePerpetualInventoryDto {
    private constructor(body: TUnarchivePerpetualInventoryDto) {
        this.perpetualInventoryId = body.perpetualInventoryId;
    }

    static create(body: unknown) {
        return new UnarchivePerpetualInventoryDto(body as TUnarchivePerpetualInventoryDto);
    }
}
