import type {IReferenceGuideEntity} from "@entities/ReferenceGuide/ReferenceGuideEntity";
import type {ReferenceGuide} from "@infrastructure/Database/Models/ReferenceGuide";
import type {TWhereFilter} from "@typings/ORM";

type TFilterReferenceGuide = Partial<IReferenceGuideEntity>;

type TWhereReferenceGuide = TWhereFilter<ReferenceGuide>;

export class ReferenceGuideFilter {
    private where: TWhereReferenceGuide;
    constructor(filters: TFilterReferenceGuide) {
        this.where = {};
        this.setReferenceGuideId(filters);
        this.setFacilityId(filters);
        this.setName(filters);
    }

    static setFilter(filters: TFilterReferenceGuide) {
        return new ReferenceGuideFilter(filters).where;
    }

    setReferenceGuideId(filters: TFilterReferenceGuide) {
        if (filters.referenceGuideId) {
            this.where.referenceGuideId = filters.referenceGuideId;
        }
    }

    setFacilityId(filters: TFilterReferenceGuide) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setName(filters: TFilterReferenceGuide) {
        if (filters.name) {
            this.where.name = filters.name;
        }
    }
}
