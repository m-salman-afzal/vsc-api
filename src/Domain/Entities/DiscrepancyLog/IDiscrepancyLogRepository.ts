import type {DiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {DiscrepancyLog} from "@infrastructure/Database/Models/DiscrepancyLog";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterDiscrepancyLog} from "@repositories/Shared/Query/DiscrepancyLogQueryBuilder";

export interface IDiscrepancyLogRepository extends IBaseRepository<DiscrepancyLog, DiscrepancyLogEntity> {
    fetchPaginatedBySearchQuery(
        searchFilters: TFilterDiscrepancyLog,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: DiscrepancyLog[]}>;
}
