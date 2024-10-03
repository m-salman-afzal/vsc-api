import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {Cart} from "@infrastructure/Database/Models/Cart";

import {CartQueryBuilder} from "./Shared/Query/CartQueryBuilder";

import type {TFilterCart} from "./Shared/Query/CartQueryBuilder";
import type {CartEntity} from "@entities/Cart/CartEntity";
import type {ICartRepository} from "@entities/Cart/ICartRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class CartRepository extends BaseRepository<Cart, CartEntity> implements ICartRepository {
    constructor() {
        super(Cart);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterCart, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("carts")
            .leftJoinAndSelect("carts.facilityUnit", "facilityUnits")
            .leftJoinAndSelect("carts.facility", "facility")
            .withDeleted()
            .leftJoinAndSelect("carts.referenceGuide", "referenceGuide")
            .orderBy("carts.cart")
            .take(pagination.perPage)
            .skip(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("carts")
            .leftJoinAndSelect("carts.facilityUnit", "facilityUnits")
            .leftJoinAndSelect("carts.facility", "facility")
            .withDeleted()
            .leftJoinAndSelect("carts.referenceGuide", "referenceGuide")
            .orderBy("carts.cart");
        const queryFilters = CartQueryBuilder.setFilter(query, searchFilters);
        const countFilters = CartQueryBuilder.setFilter(countQuery, searchFilters);

        const rows = await queryFilters.getMany();
        const count = await countFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchAllBySearchQuery(searchFilters: TFilterCart): Promise<false | Cart[]> {
        const query = this.model
            .createQueryBuilder("carts")
            .leftJoinAndSelect("carts.facilityUnit", "facilityUnits")
            .leftJoinAndSelect("carts.facility", "facility")
            .leftJoinAndSelect("carts.referenceGuide", "referenceGuide")
            .orderBy("carts.cart", "ASC");

        const queryFilters = CartQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }
}
