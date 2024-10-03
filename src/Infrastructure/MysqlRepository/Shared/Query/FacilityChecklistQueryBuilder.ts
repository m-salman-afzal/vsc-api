import type {IFacilityChecklistEntity} from "@entities/FacilityChecklist/FacilityChecklistEntity";
import type {FacilityChecklist} from "@infrastructure/Database/Models/FacilityChecklist";
import type {TQueryBuilder} from "@typings/ORM";

type TFilterFacilityCheclist = Partial<IFacilityChecklistEntity>;
type TQueryBuilderFacilityChecklist = TQueryBuilder<FacilityChecklist>;

export class FacilityChecklistQueryBuilder {
    private query: TQueryBuilderFacilityChecklist;
    constructor(query: TQueryBuilderFacilityChecklist, filters: TFilterFacilityCheclist) {
        this.query = query;

        this.setAdminId(filters);
        this.setFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderFacilityChecklist, filters) {
        return new FacilityChecklistQueryBuilder(query, filters).query;
    }

    setAdminId(filters: TFilterFacilityCheclist) {
        if (filters.adminId) {
            this.query.andWhere("admin.adminId = :adminId", {adminId: filters.adminId});
        }
    }

    setFacilityId(filters: TFilterFacilityCheclist) {
        if (filters.facilityId) {
            this.query.andWhere("facility.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }
}
