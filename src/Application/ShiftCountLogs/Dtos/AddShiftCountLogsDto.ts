import type {IShiftCountLogEntity} from "@entities/ShiftCountLog/ShiftCountLogEntity";
import type {IShiftCountLogDrugEntity} from "@entities/ShiftCountLogDrug/ShiftCountLogDrugEntity";

type TAddShiftCountLogsDto = Omit<IShiftCountLogEntity, "shiftCountLogId"> & {
    shiftCountLogDrugs: (Omit<IShiftCountLogDrugEntity, "shiftCountLogId" | "shiftCountLogDrugId"> & {
        perpetualInventoryId: string;
    })[];
};
export interface AddShiftCountLogsDto extends TAddShiftCountLogsDto {}

export class AddShiftCountLogsDto {
    private constructor(body: TAddShiftCountLogsDto) {
        this.cartId = body.cartId;
        this.facilityId = body.facilityId;
        this.comment = body.comment;
        this.handOffName = body.handOffName;
        this.handOffSignature = body.handOffSignature;
        this.receiverName = body.receiverName;
        this.receiverSignature = body.receiverSignature;
        this.shiftCountLogDrugs = body.shiftCountLogDrugs;
        this.isDiscrepancy = body.isDiscrepancy;
    }

    static create(body: unknown) {
        return new AddShiftCountLogsDto(body as TAddShiftCountLogsDto);
    }
}
