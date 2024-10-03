import type {TFilterCartInventoryLogs} from "@repositories/Shared/Query/CartInventoryLogQueryBuilder";

import type {CartInventoryLogsEntity} from "@entities/CartInventoryLogs/CartInventoryLogsEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {CartInventoryLogs} from "@infrastructure/Database/Models/CartInventoryLogs";

export interface ICartInventoryLogsRepository extends IBaseRepository<CartInventoryLogs, CartInventoryLogsEntity> {
    fetchCarts(searchFilters: TFilterCartInventoryLogs): Promise<false | string[]>;
}
