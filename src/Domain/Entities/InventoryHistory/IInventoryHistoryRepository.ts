import type IBaseRepository from "@entities/IBaseRepository";
import type {InventoryHistoryEntity} from "@entities/InventoryHistory/InventoryHistoryEntity";
import type {InventoryHistory} from "@infrastructure/Database/Models/InventoryHistory";

export interface IInventoryHistoryRepository extends IBaseRepository<InventoryHistory, InventoryHistoryEntity> {}
