import type {DiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import type {PerpetualInventoryDeductionEntity} from "@entities/PerpetualInventoryDeduction/PerpetualInventoryDeductionEntity";

type TRemovePerpetualInventoryDeductionDto = Pick<PerpetualInventoryDeductionEntity, "perpetualInventoryDeductionId"> &
    Pick<
        DiscrepancyLogEntity,
        "adminId" | "facilityId" | "level" | "type" | "perpetualInventoryDeductionId" | "comment"
    >;

export interface RemovePerpetualInventoryDeductionDto extends TRemovePerpetualInventoryDeductionDto {}

export class RemovePerpetualInventoryDeductionDto {
    private constructor(body: TRemovePerpetualInventoryDeductionDto) {
        this.perpetualInventoryDeductionId = body.perpetualInventoryDeductionId;
        this.comment = body.comment;
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;
        this.level = body.level ? Number(body.level) : body.level;
        this.type = body.type;
    }

    static create(body: unknown) {
        return new RemovePerpetualInventoryDeductionDto(body as TRemovePerpetualInventoryDeductionDto);
    }
}
