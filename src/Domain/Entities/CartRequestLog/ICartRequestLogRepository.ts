import type {CartRequestLogEntity} from "@entities/CartRequestLog/CartRequestLogEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {CartRequestLog} from "@infrastructure/Database/Models/CartRequestLog";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterCartRequestLog} from "@repositories/Shared/Query/CartRequestLogQueryBuilder";

export interface ICartRequestLogRepository extends IBaseRepository<CartRequestLog, CartRequestLogEntity> {
    fetchPaginatedBySearchQuery(
        searchFilters: TFilterCartRequestLog,
        pagination: PaginationOptions
    ): Promise<
        | false
        | {
              rows: CartRequestLog[];
              count: number;
          }
    >;

    fetchPaginatedForCartFulfilled(
        searchFilters: TFilterCartRequestLog,
        pagination: PaginationOptions
    ): Promise<
        | false
        | {
              rows: CartRequestLog[];
              count: number;
          }
    >;
}
