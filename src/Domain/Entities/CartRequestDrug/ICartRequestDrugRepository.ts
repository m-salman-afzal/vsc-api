import type {CartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {CartRequestDrug} from "@infrastructure/Database/Models/CartRequestDrug";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterCartRequestDrug} from "@repositories/Shared/Query/CartRequestDrugQueryBuilder";

export interface ICartRequestDrugRepository extends IBaseRepository<CartRequestDrug, CartRequestDrugEntity> {
    fetchBySearchQuery(searchFilters: TFilterCartRequestDrug): Promise<false | CartRequestDrug[]>;

    fetchPaginatedBySearchQuery(
        searchFilters: TFilterCartRequestDrug,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: CartRequestDrug[]}>;

    fetchAllBySearchQuery(searchFilters: TFilterCartRequestDrug): Promise<false | CartRequestDrug[]>;

    fetchWithFormulary(searchFilters: TFilterCartRequestDrug): Promise<false | CartRequestDrug>;

    fetchPaginatedForCartFulfilled(
        searchFilters: TFilterCartRequestDrug,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: CartRequestDrug[]}>;

    fetchPaginatedForCartUnfulfilled(
        searchFilters: TFilterCartRequestDrug,
        pagination: PaginationOptions
    ): Promise<
        | false
        | {
              count: number;
              rows: CartRequestDrug[];
          }
    >;
}
