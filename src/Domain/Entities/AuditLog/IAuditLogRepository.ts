import type {AuditLogEntity} from "@entities/AuditLog/AuditLogEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {AuditLog} from "@infrastructure/Database/Models/AuditLog";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

export type TOrder = "ASC" | "DESC";

export interface IAuditLogRepository extends IBaseRepository<AuditLog, AuditLogEntity> {
    fetchPaginatedWithAdminFacility(
        searchFilters: TSearchFilters<AuditLog>,
        pagination: PaginationOptions,
        order?: TOrder
    ): Promise<
        | false
        | {
              rows: AuditLog[];
              count: number;
          }
    >;
}
