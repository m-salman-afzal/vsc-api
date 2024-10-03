import type {DiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import type {IPerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

type TRemovePerpetualInventoryDto = Pick<IPerpetualInventoryEntity, "perpetualInventoryId"> &
    Pick<
        DiscrepancyLogEntity,
        "adminId" | "facilityId" | "level" | "type" | "perpetualInventoryDeductionId" | "comment"
    >;

export interface RemovePerpetualInventoryDto extends TRemovePerpetualInventoryDto {}

export class RemovePerpetualInventoryDto {
    private constructor(body: TRemovePerpetualInventoryDto) {
        this.perpetualInventoryId = body.perpetualInventoryId;
        this.comment = body.comment;
        this.adminId = body.adminId;
    }

    static create(body: unknown) {
        return new RemovePerpetualInventoryDto(body as TRemovePerpetualInventoryDto);
    }
}
