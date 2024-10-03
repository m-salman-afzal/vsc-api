import type IBaseRepository from "@entities/IBaseRepository";
import type {InventoryControlEntity} from "@entities/InventoryControl/InventoryControlEntity";
import type {InventoryControl} from "@infrastructure/Database/Models/InventoryControl";

export interface IInventoryControlRepository extends IBaseRepository<InventoryControl, InventoryControlEntity> {}
