import type {ISafeReportEntity} from "@entities/SafeReport/SafeReportEntity";
import type {SafeReport} from "@infrastructure/Database/Models/SafeReport";
import type {TWhereFilter} from "@typings/ORM";

export type TFilterSafeReport = Partial<ISafeReportEntity> & {deletedAt?: string | null};
type TWhereSafeReport = TWhereFilter<SafeReport>;

export class SafeReportFilter {
    private where: TWhereSafeReport;
    constructor(filters: TFilterSafeReport) {
        this.where = {};
        this.safeReportId(filters);
    }

    static setFilter(filters: TFilterSafeReport) {
        return new SafeReportFilter(filters).where;
    }

    safeReportId(filters: TFilterSafeReport) {
        if (filters.safeReportId) {
            this.where.safeReportId = filters.safeReportId;
        }
    }
}
