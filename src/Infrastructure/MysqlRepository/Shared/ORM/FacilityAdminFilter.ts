import type {IFacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";
import type {FacilityAdmin} from "@infrastructure/Database/Models/FacilityAdmin";
import type {TWhereFilter} from "@typings/ORM";

type TFilterFacilityAdmin = Partial<IFacilityAdminEntity>;

type TWhereFacilityAdmin = TWhereFilter<FacilityAdmin>;

class FacilityAdminFilter {
    private where: TWhereFacilityAdmin;
    constructor(filters: TFilterFacilityAdmin) {
        this.where = {};
        this.setFacilityAdminId(filters);
        this.setFacilityId(filters);
        this.setAdminId(filters);
    }

    static setFilter(filters: TFilterFacilityAdmin) {
        return new FacilityAdminFilter(filters).where;
    }

    setFacilityAdminId(filters: TFilterFacilityAdmin) {
        if (Array.isArray(filters.facilityAdminId)) {
            this.where.facilityAdminId = filters.facilityAdminId;
        }
    }

    setFacilityId(filters: TFilterFacilityAdmin) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setAdminId(filters: TFilterFacilityAdmin) {
        if (filters.adminId) {
            this.where.adminId = filters.adminId;
        }
    }
}

export default FacilityAdminFilter;
