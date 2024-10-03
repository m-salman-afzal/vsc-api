import type {ISafeFacilityChecklistEntity} from "@entities/SafeFacilityChecklist/SafeFacilityChecklistEntity";
import type {SafeFacilityChecklist} from "@infrastructure/Database/Models/SafeFacilityChecklist";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterSafeFacilityChecklist = Partial<ISafeFacilityChecklistEntity>;
type TQueryBuilderSafeFacilityChecklist = TQueryBuilder<SafeFacilityChecklist>;

export class SafeFacilityChecklistQueryBuilder {
    private query: TQueryBuilderSafeFacilityChecklist;
    constructor(query: TQueryBuilderSafeFacilityChecklist, filters: TFilterSafeFacilityChecklist) {
        this.query = query;
        this.setSafeReportId(filters);
    }

    static setFilter(query: TQueryBuilderSafeFacilityChecklist, filters) {
        return new SafeFacilityChecklistQueryBuilder(query, filters).query;
    }

    setSafeReportId(filters: TFilterSafeFacilityChecklist) {
        if (Array.isArray(filters.safeReportId)) {
            this.query.andWhere("safeFacilityChecklist.safeReportId IN (:...safeReportId)", {
                safeReportId: filters.safeReportId
            });

            return;
        }

        if (filters.safeReportId) {
            this.query.andWhere("safeFacilityChecklist.safeReportId = :safeReportId", {
                safeReportId: filters.safeReportId
            });
        }
    }
}
