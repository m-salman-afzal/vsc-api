import {injectable} from "tsyringe";

import {ORDER_BY} from "@appUtils/Constants";

import BaseRepository from "@repositories/BaseRepository";

import {PerpetualInventory} from "@infrastructure/Database/Models/PerpetualInventory";

import {FETCH_ALL_PERPETUAL_INVENTORY_DEDUCTIONS} from "./Shared/Query/FieldsBuilder";
import {PerpetualInventoryQueryBuilder} from "./Shared/Query/PerpetualInventoryQueryBuilder";

import type {TFilterPerpetualInventory} from "./Shared/Query/PerpetualInventoryQueryBuilder";
import type {
    IPerpetualInventoryRepository,
    TPerpetualInventoryWithDeduction
} from "@entities/PerpetualInventory/IPerpetualInventoryRepository";
import type {PerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";
import type {Cart} from "@infrastructure/Database/Models/Cart";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class PerpetualInventoryRepository
    extends BaseRepository<PerpetualInventory, PerpetualInventoryEntity>
    implements IPerpetualInventoryRepository
{
    constructor() {
        super(PerpetualInventory);
    }
    async fetchLastest(): Promise<PerpetualInventory | false> {
        const pi = await this.model
            .createQueryBuilder("perpetualInventory")
            .withDeleted()
            .orderBy("createdAt", "DESC")
            .getOne();

        if (!pi) {
            return false;
        }

        return pi;
    }

    async fetchPaginatedWithDeductions(searchFilters: TFilterPerpetualInventory, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("perpetualInventory")
            .leftJoinAndSelect("perpetualInventory.perpetualInventoryDeduction", "pid")
            .leftJoinAndSelect("pid.admin", "admin")
            .orderBy("perpetualInventory.id", ORDER_BY.ASC)
            .addOrderBy("pid.createdAt", ORDER_BY.DESC);

        const countQuery = this.model
            .createQueryBuilder("perpetualInventory")
            .leftJoinAndSelect("perpetualInventory.perpetualInventoryDeduction", "pid")
            .leftJoinAndSelect("pid.admin", "admin");

        const queryFilters = PerpetualInventoryQueryBuilder.setFilter(query, searchFilters);
        const countFilters = PerpetualInventoryQueryBuilder.setFilter(countQuery, searchFilters);
        const rows = await queryFilters.limit(pagination.perPage).offset(pagination.offset).getMany();
        const count = await countFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchPaginatedWithQueryBuilder(searchFilters: TFilterPerpetualInventory, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("perpetualInventory")
            .orderBy("perpetualInventory.id", ORDER_BY.ASC);

        const countQuery = this.model.createQueryBuilder("perpetualInventory");

        const queryFilters = PerpetualInventoryQueryBuilder.setFilter(query, searchFilters);
        const countFilters = PerpetualInventoryQueryBuilder.setFilter(countQuery, {...searchFilters, name: ""});

        const rows = await queryFilters.limit(pagination.perPage).offset(pagination.offset).getMany();
        const count = await countFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchCarts(searchFilters: TFilterPerpetualInventory) {
        const query = this.model
            .createQueryBuilder("perpetualInventory")
            .select("perpetualInventory.cartId", "cartId")
            .addSelect("cart.*")
            .leftJoin("perpetualInventory.cart", "cart")
            .groupBy("perpetualInventory.cartId")
            .andWhere("perpetualInventory.cartId IS NOT NULL")
            .orderBy("cart.cart", "ASC");

        const queryFilters = PerpetualInventoryQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getRawMany();

        if (rows.length === 0) {
            return false;
        }

        return rows as Cart[];
    }

    async fetchAllWithDeductions(searchFilters: TFilterPerpetualInventory) {
        const query = this.model
            .createQueryBuilder("perpetualInventory")
            .leftJoinAndSelect("perpetualInventory.cart", "cart")
            .leftJoinAndSelect("perpetualInventory.perpetualInventoryDeduction", "pid")
            .leftJoinAndSelect("pid.admin", "admin")
            .orderBy("perpetualInventory.createdAt", "ASC");

        const queryFilters = PerpetualInventoryQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.select(FETCH_ALL_PERPETUAL_INVENTORY_DEDUCTIONS).getRawMany();

        if (rows.length === 0) {
            return false;
        }

        return rows as TPerpetualInventoryWithDeduction[];
    }
}
