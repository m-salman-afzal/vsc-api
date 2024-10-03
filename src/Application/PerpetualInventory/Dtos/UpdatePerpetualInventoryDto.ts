import type {DiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import type {IPerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

type TUpdatePerpetualInventoryDto = Pick<
    IPerpetualInventoryEntity,
    "perpetualInventoryId" | "controlledId" | "patientName" | "providerName" | "quantityAllocated"
> &
    Pick<
        DiscrepancyLogEntity,
        "adminId" | "facilityId" | "level" | "type" | "perpetualInventoryDeductionId" | "comment"
    > &
    Partial<Pick<IPerpetualInventoryEntity, "tr" | "rx" | "isArchived">>;

export interface UpdatePerpetualInventoryDto extends TUpdatePerpetualInventoryDto {}

export class UpdatePerpetualInventoryDto {
    private constructor(body: TUpdatePerpetualInventoryDto) {
        this.perpetualInventoryId = body.perpetualInventoryId;
        this.tr = body.tr as string;
        this.rx = body.rx as string;
        this.controlledId = body.controlledId;
        this.patientName = body.patientName;
        this.providerName = body.providerName;
        this.quantityAllocated = body.quantityAllocated;
        this.comment = body.comment;
        this.isArchived = body.isArchived as boolean;
        this.adminId = body.adminId;
    }

    static create(body: unknown) {
        return new UpdatePerpetualInventoryDto(body as TUpdatePerpetualInventoryDto);
    }
}
