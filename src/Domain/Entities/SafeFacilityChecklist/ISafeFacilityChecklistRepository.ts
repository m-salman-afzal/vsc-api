import type IBaseRepository from "@entities/IBaseRepository";
import type {SafeFacilityChecklistEntity} from "@entities/SafeFacilityChecklist/SafeFacilityChecklistEntity";
import type {SafeFacilityChecklist} from "@infrastructure/Database/Models/SafeFacilityChecklist";
import type {TFilterSafeFacilityChecklist} from "@repositories/Shared/Query/SafeFacilityChecklistQueryBuilder";

export interface ISafeFacilityChecklistRepository
    extends IBaseRepository<SafeFacilityChecklist, SafeFacilityChecklistEntity> {
    fetchAllSafeReportCheckList(searchFilter: TFilterSafeFacilityChecklist): Promise<false | SafeFacilityChecklist[]>;
}
