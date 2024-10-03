import type {ShiftCountLogEntity} from "./ShiftCountLogEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {ShiftCountLogs} from "@infrastructure/Database/Models/ShiftCountLogs";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterShiftCountLogs} from "@repositories/Shared/Query/ShiftCountLogsQueryBuilder";

export interface IShiftCountLogRepository extends IBaseRepository<ShiftCountLogs, ShiftCountLogEntity> {
    fetchPaginatedWithCarts(
        searchFilters: TFilterShiftCountLogs,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: ShiftCountLogs[]}>;
}
