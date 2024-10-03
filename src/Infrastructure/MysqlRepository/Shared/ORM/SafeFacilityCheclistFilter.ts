import type {ISafeFacilityChecklistEntity} from "@entities/SafeFacilityChecklist/SafeFacilityChecklistEntity";
import type {SafeFacilityChecklist} from "@infrastructure/Database/Models/SafeFacilityChecklist";
import type {TWhereFilter} from "@typings/ORM";

export type TFilterSafeFacilityChecklist = Partial<ISafeFacilityChecklistEntity> & {deletedAt?: string | null};
type TWhereSafeFacilityChecklist = TWhereFilter<SafeFacilityChecklist>;

export class SafeFacilityChecklistFilter {
    private where: TWhereSafeFacilityChecklist;
    constructor(filters: TFilterSafeFacilityChecklist) {
        this.where = {};

        this.safeFacilityChecklistId(filters);
        this.facilityChecklistId(filters);
        this.safeReportId(filters);
    }

    static setFilter(filters: TFilterSafeFacilityChecklist) {
        return new SafeFacilityChecklistFilter(filters).where;
    }

    safeFacilityChecklistId(filters: TFilterSafeFacilityChecklist) {
        if (filters.safeFacilityChecklistId) {
            this.where.safeFacilityChecklistId = filters.safeFacilityChecklistId;
        }
    }

    facilityChecklistId(filters: TFilterSafeFacilityChecklist) {
        if (filters.facilityChecklistId) {
            this.where.facilityChecklistId = filters.facilityChecklistId;
        }
    }

    safeReportId(filters: TFilterSafeFacilityChecklist) {
        if (filters.safeReportId) {
            this.where.safeReportId = filters.safeReportId;
        }
    }
}
