import type IBaseRepository from "@entities/IBaseRepository";
import type {InventoryEntity} from "@entities/Inventory/InventoryEntity";
import type {Inventory} from "@infrastructure/Database/Models/Inventory";

export interface IInventoryRepository extends IBaseRepository<Inventory, InventoryEntity> {}
