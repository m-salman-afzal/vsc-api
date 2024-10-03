import type {TOrder} from "@entities/AuditLog/IAuditLogRepository";
import type IBaseRepository from "@entities/IBaseRepository";
import type {SafeReportNotificationEntity} from "@entities/SafeReportNotification/SafeReportNotificationEntity";
import type {SafeReportNotification} from "@infrastructure/Database/Models/SafeReportNotification";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

export interface ISafeReportNotificationRepository
    extends IBaseRepository<SafeReportNotification, SafeReportNotificationEntity> {
    fetchPaginatedWithComment(
        searchFilters: TSearchFilters<SafeReportNotification>,
        pagination: PaginationOptions,
        order?: TOrder
    ): Promise<
        | false
        | {
              rows: SafeReportNotification[];
              count: number;
          }
    >;
}
