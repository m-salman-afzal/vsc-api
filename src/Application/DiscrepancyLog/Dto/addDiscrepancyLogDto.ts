import type {IDiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";

type TAddDiscrepancyDto = Omit<
    IDiscrepancyLogEntity,
    "discrepancyLogId" | "perpetualInventoryDeductionId" | "type" | "level"
>;
export interface AddDiscrepancyDto extends TAddDiscrepancyDto {}

export class AddDiscrepancyDto {
    private constructor(body: TAddDiscrepancyDto) {
        this.cartId = body.cartId;
        this.facilityId = body.facilityId;
        this.comment = body.comment;
        this.perpetualInventoryId = body.perpetualInventoryId;
        this.adminId = body.adminId;
        this.expectedQuantity = body.expectedQuantity;
        this.handOffName = body.handOffName;
        this.receiverName = body.receiverName;
        this.quantityAllocated = body.quantityAllocated;
    }

    static create(body: unknown) {
        return new AddDiscrepancyDto(body as TAddDiscrepancyDto);
    }
}
