import type {FacilityChecklistEntity} from "@entities/FacilityChecklist/FacilityChecklistEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {FacilityChecklist} from "@infrastructure/Database/Models/FacilityChecklist";
import type {TSearchFilters} from "@typings/ORM";

export interface IFacilityChecklistRepository extends IBaseRepository<FacilityChecklist, FacilityChecklistEntity> {
    fetchByQuery(searchFilters: TSearchFilters<FacilityChecklist>): Promise<false | FacilityChecklist[]>;
}
