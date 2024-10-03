import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {IHistoryPhysicalEntity} from "@entities/HistoryPhysical/HistoryPhysicalEntity";
import type {HistoryPhysical} from "@infrastructure/Database/Models/HistoryPhysical";
import type {TWhereFilter} from "@typings/ORM";

type THistoryPhysicalFilter = Partial<IHistoryPhysicalEntity> & Partial<IFacilityEntity>;

type TWhereFile = TWhereFilter<HistoryPhysical>;

export class HistoryPhysicalFilter {
    private where: TWhereFile;

    constructor(filters: THistoryPhysicalFilter) {
        this.where = {};

        this.setIsYearly(filters);
        this.setFacilityId(filters);
    }

    static setFilter(filters: THistoryPhysicalFilter) {
        return new HistoryPhysicalFilter(filters).where;
    }

    setIsYearly(filters: THistoryPhysicalFilter) {
        if (filters.isYearly) {
            this.where.isYearly = filters.isYearly;
        }
    }

    setFacilityId(filters: THistoryPhysicalFilter) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }
}
