import type {IShiftCountLogEntity} from "@entities/ShiftCountLog/ShiftCountLogEntity";

type TGetShiftCountLogsDto = Pick<IShiftCountLogEntity, "cartId" | "facilityId"> & {
    fromDate: string;
    toDate: string;
    searchText: string;
};

export interface GetShiftCountLogsDto extends TGetShiftCountLogsDto {}

export class GetShiftCountLogsDto {
    private constructor(body: TGetShiftCountLogsDto) {
        this.cartId = body.cartId;
        this.fromDate = body.fromDate;
        this.toDate = body.toDate;
        this.facilityId = body.facilityId;
        this.searchText = body.searchText;
    }

    static create(body: unknown) {
        return new GetShiftCountLogsDto(body as TGetShiftCountLogsDto);
    }
}
