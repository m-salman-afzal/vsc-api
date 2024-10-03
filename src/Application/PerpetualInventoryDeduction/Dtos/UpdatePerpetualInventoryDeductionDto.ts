import type {DiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import type {PerpetualInventoryDeductionEntity} from "@entities/PerpetualInventoryDeduction/PerpetualInventoryDeductionEntity";

type TUpdatePerpetualInventoryDeductionDto = Pick<
    PerpetualInventoryDeductionEntity,
    "perpetualInventoryDeductionId" | "date" | "time" | "providerName" | "patientName"
> &
    Pick<
        DiscrepancyLogEntity,
        "adminId" | "facilityId" | "level" | "type" | "perpetualInventoryDeductionId" | "comment"
    > & {quantityDeducted: number};

export interface UpdatePerpetualInventoryDeductionDto extends TUpdatePerpetualInventoryDeductionDto {}

export class UpdatePerpetualInventoryDeductionDto {
    private constructor(body: TUpdatePerpetualInventoryDeductionDto) {
        this.perpetualInventoryDeductionId = body.perpetualInventoryDeductionId;
        this.comment = body.comment;
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;
        this.level = body.level ? Number(body.level) : body.level;
        this.type = body.type;
        this.date = body.date;
        this.time = body.time;
        this.providerName = body.providerName;
        this.patientName = body.patientName;
        this.quantityDeducted = body.quantityDeducted;
    }

    static create(body: unknown) {
        return new UpdatePerpetualInventoryDeductionDto(body as TUpdatePerpetualInventoryDeductionDto);
    }
}
