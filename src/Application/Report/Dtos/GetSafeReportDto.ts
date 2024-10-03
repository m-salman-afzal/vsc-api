import type {IReportEntity} from "@entities/Report/ReportEntity";

type TGetSafeReportDto = Pick<IReportEntity, "reportId">;

export interface GetSafeReportDto extends TGetSafeReportDto {}

export class GetSafeReportDto {
    constructor(body: TGetSafeReportDto) {
        this.reportId = body.reportId;
    }

    static create(body: unknown) {
        return new GetSafeReportDto(body as GetSafeReportDto);
    }
}
