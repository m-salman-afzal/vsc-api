import type {ISafeReportEventLocationEntity} from "@entities/SafeReportEventLocation/SafeReportEventLocationEntity";
import type {SafeReportEventLocation} from "@infrastructure/Database/Models/SafeReportEventLocation";
import type {TWhereFilter} from "@typings/ORM";

export type TFilterSafeReportEventLocation = Partial<ISafeReportEventLocationEntity> & {deletedAt?: string | null};
type TWhereSafeReportEventLocation = TWhereFilter<SafeReportEventLocation>;

export class SafeReportEventLocationFilter {
    private where: TWhereSafeReportEventLocation;
    constructor(filters: TFilterSafeReportEventLocation) {
        this.where = {};

        this.safeReportEventLocationId(filters);
        this.safeEventLocationId(filters);
        this.safeReportId(filters);
    }

    static setFilter(filters: TFilterSafeReportEventLocation) {
        return new SafeReportEventLocationFilter(filters).where;
    }

    safeReportEventLocationId(filters: TFilterSafeReportEventLocation) {
        if (filters.safeReportEventLocationId) {
            this.where.safeReportEventLocationId = filters.safeReportEventLocationId;
        }
    }

    safeEventLocationId(filters: TFilterSafeReportEventLocation) {
        if (filters.safeEventLocationId) {
            this.where.safeEventLocationId = filters.safeEventLocationId;
        }
    }

    safeReportId(filters: TFilterSafeReportEventLocation) {
        if (filters.safeReportId) {
            this.where.safeReportId = filters.safeReportId;
        }
    }
}
