import {injectable} from "tsyringe";

import {ORDER_BY} from "@appUtils/Constants";

import BaseRepository from "@repositories/BaseRepository";

import {CartRequestDrug} from "@infrastructure/Database/Models/CartRequestDrug";

import {CartRequestDrugQueryBuilder} from "./Shared/Query/CartRequestDrugQueryBuilder";

import type {TFilterCartRequestDrug} from "./Shared/Query/CartRequestDrugQueryBuilder";
import type {CartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import type {ICartRequestDrugRepository} from "@entities/CartRequestDrug/ICartRequestDrugRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class CartRequestDrugRepository
    extends BaseRepository<CartRequestDrug, CartRequestDrugEntity>
    implements ICartRequestDrugRepository
{
    constructor() {
        super(CartRequestDrug);
    }

    async fetchBySearchQuery(searchFilters: TFilterCartRequestDrug) {
        const query = this.model
            .createQueryBuilder("cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestLog", "cartRequestLog")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestDrug.cart", "cart")
            .leftJoinAndSelect("cartRequestDrug.referenceGuideDrug", "referenceGuideDrug")
            .leftJoinAndSelect("referenceGuideDrug.cartRequestForm", "cartRequestFormForAfterHour")
            .leftJoinAndSelect("referenceGuideDrug.referenceGuide", "referenceGuide")
            .leftJoinAndSelect("cartRequestDrug.formulary", "formulary")
            .leftJoinAndSelect("cartRequestDrug.cartRequestForm", "cartRequestForm")
            .orderBy("cartRequestDrug.id", ORDER_BY.ASC);

        const queryFilters = CartRequestDrugQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterCartRequestDrug, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestLog", "cartRequestLog")
            .leftJoinAndSelect("cartRequestDrug.cartRequestAllocationLog", "cartRequestAllocationLog")
            .leftJoinAndSelect("cartRequestDrug.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestDrug.referenceGuideDrug", "referenceGuideDrug")
            .leftJoinAndSelect("referenceGuideDrug.referenceGuide", "referenceGuide")
            .leftJoinAndSelect("cartRequestDrug.formulary", "formulary")
            .withDeleted()
            .orderBy("formulary.name", ORDER_BY.ASC)
            .limit(pagination.perPage)
            .offset(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestLog", "cartRequestLog")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestDrug.referenceGuideDrug", "referenceGuideDrug")
            .leftJoinAndSelect("referenceGuideDrug.referenceGuide", "referenceGuide")
            .leftJoinAndSelect("cartRequestDrug.formulary", "formulary")
            .withDeleted();

        const queryFilters = CartRequestDrugQueryBuilder.setFilter(query, searchFilters);
        const countQueryFilters = CartRequestDrugQueryBuilder.setFilter(countQuery, searchFilters);

        const rows = await queryFilters.getMany();
        const count = await countQueryFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchAllBySearchQuery(searchFilters: TFilterCartRequestDrug) {
        const query = this.model
            .createQueryBuilder("cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestLog", "cartRequestLog")
            .leftJoinAndSelect("cartRequestDrug.cartRequestAllocationLog", "cartRequestAllocationLog")
            .leftJoinAndSelect("cartRequestDrug.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestDrug.referenceGuideDrug", "referenceGuideDrug")
            .leftJoinAndSelect("referenceGuideDrug.referenceGuide", "referenceGuide")
            .leftJoinAndSelect("cartRequestDrug.formulary", "formulary")
            .withDeleted()
            .leftJoinAndSelect("cartRequestDrug.cartRequestDeduction", "cartRequestDeduction")
            .where("cartRequestDrug.deletedAt IS NULL")
            .orderBy("formulary.name", ORDER_BY.ASC);

        const queryFilters = CartRequestDrugQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchWithFormulary(searchFilters: TFilterCartRequestDrug) {
        const query = this.model
            .createQueryBuilder("cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.formulary", "formulary");

        const queryFilters = CartRequestDrugQueryBuilder.setFilter(query, searchFilters);

        const row = await queryFilters.getOne();

        if (!row) {
            return false;
        }

        return row;
    }

    async fetchPaginatedForCartUnfulfilled(searchFilters: TFilterCartRequestDrug, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestLog", "cartRequestLog")
            .leftJoinAndSelect("cartRequestDrug.formulary", "formulary")
            .leftJoinAndSelect("cartRequestDrug.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("formulary.inventory", "inventory")
            .leftJoinAndSelect("inventory.controlledDrug", "controlledDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestDeduction", "cartRequestDeduction")
            .orderBy("formulary.name", "ASC")
            .take(pagination.perPage)
            .skip(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestLog", "cartRequestLog")
            .leftJoinAndSelect("cartRequestDrug.formulary", "formulary")
            .leftJoinAndSelect("cartRequestDrug.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("formulary.inventory", "inventory")
            .leftJoinAndSelect("inventory.controlledDrug", "controlledDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestDeduction", "cartRequestDeduction");

        const queryFilters = CartRequestDrugQueryBuilder.setFilter(query, searchFilters);
        const countFilters = CartRequestDrugQueryBuilder.setFilter(countQuery, searchFilters);

        const rows = await queryFilters.getMany();
        const count = await countFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchPaginatedForCartFulfilled(searchFilters: TFilterCartRequestDrug, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestLog", "cartRequestLog")
            .leftJoinAndSelect("cartRequestDrug.cartRequestAllocationLog", "cartRequestAllocationLog")
            .leftJoinAndSelect("cartRequestDrug.formulary", "formulary")
            .leftJoinAndSelect("cartRequestDrug.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestDrug.allocatedByAdmin", "allocatedByAdmin")
            .leftJoinAndSelect("formulary.inventory", "inventory")
            .leftJoinAndSelect("inventory.controlledDrug", "controlledDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestDeduction", "cartRequestDeduction")
            .orderBy("formulary.name", "ASC")
            .limit(pagination.perPage)
            .offset(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestLog", "cartRequestLog")
            .leftJoinAndSelect("cartRequestDrug.cartRequestAllocationLog", "cartRequestAllocationLog")
            .leftJoinAndSelect("cartRequestDrug.formulary", "formulary")
            .leftJoinAndSelect("cartRequestDrug.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestDrug.allocatedByAdmin", "allocatedByAdmin")
            .leftJoinAndSelect("formulary.inventory", "inventory")
            .leftJoinAndSelect("inventory.controlledDrug", "controlledDrug")
            .leftJoinAndSelect("cartRequestDrug.cartRequestDeduction", "cartRequestDeduction");

        const queryFilters = CartRequestDrugQueryBuilder.setFilter(query, searchFilters);
        const countFilters = CartRequestDrugQueryBuilder.setFilter(countQuery, searchFilters);

        const rows = await queryFilters.getMany();
        const count = await countFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }
}
