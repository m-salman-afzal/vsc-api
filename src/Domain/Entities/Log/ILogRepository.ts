import type IBaseRepository from "@entities/IBaseRepository";
import type LogEntity from "@entities/Log/LogEntity";
import type Log from "@infrastructure/Database/Models/Log";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

export default interface ILogRepository extends IBaseRepository<Log, LogEntity> {
    fetchPaginatedBySearchQuery(
        searchFilters: TSearchFilters<Log> & {
            toDate?: string;
            fromDate?: string;
            text?: string;
        },
        pagination: PaginationOptions
    ): Promise<
        | false
        | {
              count: number;
              rows: Log[];
          }
    >;
}
