import type {HistoryPhysicalEntity} from "@entities/HistoryPhysical/HistoryPhysicalEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {HistoryPhysical} from "@infrastructure/Database/Models/HistoryPhysical";
import type {Patient} from "@infrastructure/Database/Models/Patient";
import type {TSearchFilters} from "@typings/ORM";

export default interface IHistoryPhysicalRepository extends IBaseRepository<HistoryPhysical, HistoryPhysicalEntity> {
    fetchBySearchQuery(
        searchFilters: TSearchFilters<HistoryPhysical> & TSearchFilters<Patient> & {toDate?: string; fromDate?: string}
    ): Promise<false | (HistoryPhysical & Patient)[]>;
}
