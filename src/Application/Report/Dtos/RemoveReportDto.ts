import type {IReportEntity} from "@entities/Report/ReportEntity";

type TRemoveReportDto = Pick<IReportEntity, "reportId">;

export interface RemoveReportDto extends TRemoveReportDto {}

export class RemoveReportDto {
    constructor(body: TRemoveReportDto) {
        this.reportId = body.reportId;
    }

    static create(body: unknown) {
        return new RemoveReportDto(body as RemoveReportDto);
    }
}
