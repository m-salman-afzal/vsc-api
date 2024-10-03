import type {IShiftCountLogDrugEntity} from "@entities/ShiftCountLogDrug/ShiftCountLogDrugEntity";

type TAddShiftCountLogDrugsDto = {
    shiftCountLogDrugs: Omit<IShiftCountLogDrugEntity, "shiftCountLogDrugId" | "shiftCountLogId">[];
    shiftCountLogId: string;
} & {};

export interface AddShiftCountLogDrugsDto extends TAddShiftCountLogDrugsDto {}

export class AddShiftCountLogDrugsDto {
    private constructor(body: TAddShiftCountLogDrugsDto) {
        this.shiftCountLogId = body.shiftCountLogId;
        this.shiftCountLogDrugs = body.shiftCountLogDrugs;
    }

    static create(body: unknown) {
        return new AddShiftCountLogDrugsDto(body as TAddShiftCountLogDrugsDto);
    }
}
