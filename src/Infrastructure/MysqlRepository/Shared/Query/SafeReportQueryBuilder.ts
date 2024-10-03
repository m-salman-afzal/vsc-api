import type {ISafeReportEntity} from "@entities/SafeReport/SafeReportEntity";
import type {SafeReport} from "@infrastructure/Database/Models/SafeReport";
import type {TQueryBuilder} from "@typings/ORM";

type TFilterSafeReport = Partial<ISafeReportEntity>;
type TQueryBuilderSafeReport = TQueryBuilder<SafeReport>;

export class SafeReportQueryBuilder {
    private query: TQueryBuilderSafeReport;
    constructor(query: TQueryBuilderSafeReport, filters: TFilterSafeReport) {
        this.query = query;
        this.setSafeReportId(filters);
    }

    static setFilter(query: TQueryBuilderSafeReport, filters) {
        return new SafeReportQueryBuilder(query, filters).query;
    }

    setSafeReportId(filters: TFilterSafeReport) {
        if (filters.safeReportId) {
            this.query.andWhere("SafeReport.safeReportId = :safeReportId", {safeReportId: filters.safeReportId});
        }
    }
}
