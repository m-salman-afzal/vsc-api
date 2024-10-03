import type {PerpetualInventoryEntity} from "./PerpetualInventoryEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {Cart} from "@infrastructure/Database/Models/Cart";
import type {PerpetualInventory} from "@infrastructure/Database/Models/PerpetualInventory";
import type {PerpetualInventoryDeduction} from "@infrastructure/Database/Models/PerpetualInventoryDeduction";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterPerpetualInventory} from "@repositories/Shared/Query/PerpetualInventoryQueryBuilder";

export type TPerpetualInventoryWithDeduction = PerpetualInventory &
    PerpetualInventoryDeduction & {adminFirstName: string; adminLastName: string; cart: string};

export interface IPerpetualInventoryRepository extends IBaseRepository<PerpetualInventory, PerpetualInventoryEntity> {
    fetchLastest(): Promise<PerpetualInventory | false>;
    fetchPaginatedWithDeductions(
        searchFilters: TFilterPerpetualInventory,
        pagination: PaginationOptions
    ): Promise<{count: number; rows: PerpetualInventory[]} | false>;
    fetchCarts(searchFilters: TFilterPerpetualInventory): Promise<Cart[] | false>;
    fetchAllWithDeductions(
        searchFilters: TFilterPerpetualInventory
    ): Promise<TPerpetualInventoryWithDeduction[] | false>;
}
