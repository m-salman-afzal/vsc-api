import type {CartEntity} from "./CartEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {Cart} from "@infrastructure/Database/Models/Cart";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterCart} from "@repositories/Shared/Query/CartQueryBuilder";

export interface ICartRepository extends IBaseRepository<Cart, CartEntity> {
    fetchPaginatedBySearchQuery(
        searchFilters: TFilterCart,
        pagination: PaginationOptions
    ): Promise<
        | false
        | {
              count: number;
              rows: Cart[];
          }
    >;

    fetchAllBySearchQuery(searchFilters: TFilterCart): Promise<false | Cart[]>;
}
