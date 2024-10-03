import type {TOrder} from "@entities/AuditLog/IAuditLogRepository";
import type {BridgeTherapyLogEntity} from "@entities/BridgeTherapyLog/BridgeTherapyLogEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {Admin} from "@infrastructure/Database/Models/Admin";
import type {BridgeTherapyLog} from "@infrastructure/Database/Models/BridgeTherapyLog";
import type {Facility} from "@infrastructure/Database/Models/Facility";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterBridgeTherapyLog} from "@repositories/Shared/Query/BridgeTherapyLogQueryBuilder";

export default interface IBridgeTherapyLogRepository extends IBaseRepository<BridgeTherapyLog, BridgeTherapyLogEntity> {
    fetchPaginatedBySearchQuery(
        searchFilters: TFilterBridgeTherapyLog,
        pagination: PaginationOptions,
        order: TOrder
    ): Promise<
        | false
        | {
              count: number;
              rows: (BridgeTherapyLog & Admin & Facility)[];
          }
    >;
}
