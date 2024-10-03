import type {CartInventoryLogsDrugEntity} from "@entities/CartInventoryLogsDrug/CartInventoryLogsDrugEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {CartInventoryLogsDrug} from "@infrastructure/Database/Models/CartInventoryLogsDrug";

export interface ICartInventoryLogsDrugRepository
    extends IBaseRepository<CartInventoryLogsDrug, CartInventoryLogsDrugEntity> {}
