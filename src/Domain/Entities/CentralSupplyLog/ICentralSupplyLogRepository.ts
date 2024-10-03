import type {CentralSupplyLogEntity} from "@entities/CentralSupplyLog/CentralSupplyLogEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {CentralSupplyLog} from "@infrastructure/Database/Models/CentralSupplyLog";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterCentralSupplyLog} from "@repositories/Shared/Query/CentralSupplyLogQueryBuilder";

export interface ICentralSupplyLogRepository extends IBaseRepository<CentralSupplyLog, CentralSupplyLogEntity> {
    fetchPaginatedBySearchQuery(
        searchFilters: TFilterCentralSupplyLog,
        pagination: PaginationOptions
    ): Promise<{count: number; rows: CentralSupplyLog[]} | false>;

    fetchMinMaxOrderedQuantity(): Promise<{orderedQuantityMin: number; orderedQuantityMax: number}>;

    fetchRunningMinMaxOrderedQuantity(
        facilityId: string
    ): Promise<{orderedQuantityMin: number; orderedQuantityMax: number}[]>;
}
