import type {IShiftCountLogDrugEntity} from "@entities/ShiftCountLogDrug/ShiftCountLogDrugEntity";

type TGetShiftCountLogDrugsDto = Pick<IShiftCountLogDrugEntity, "shiftCountLogId"> & {};

export interface GetShiftCountLogDrugsDto extends TGetShiftCountLogDrugsDto {}

export class GetShiftCountLogDrugsDto {
    private constructor(body: TGetShiftCountLogDrugsDto) {
        this.shiftCountLogId = body.shiftCountLogId;
    }

    static create(body: unknown) {
        return new GetShiftCountLogDrugsDto(body as TGetShiftCountLogDrugsDto);
    }
}
