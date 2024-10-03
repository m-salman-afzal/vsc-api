import {injectable} from "tsyringe";

import {ORDER_BY} from "@appUtils/Constants";

import BaseRepository from "@repositories/BaseRepository";

import {CartRequestDrug} from "@infrastructure/Database/Models/CartRequestDrug";
import {CartRequestLog} from "@infrastructure/Database/Models/CartRequestLog";

import {CartRequestLogQueryBuilder} from "./Shared/Query/CartRequestLogQueryBuilder";

import type {TFilterCartRequestLog} from "./Shared/Query/CartRequestLogQueryBuilder";
import type {CartRequestLogEntity} from "@entities/CartRequestLog/CartRequestLogEntity";
import type {ICartRequestLogRepository} from "@entities/CartRequestLog/ICartRequestLogRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class CartRequestLogRepository
    extends BaseRepository<CartRequestLog, CartRequestLogEntity>
    implements ICartRequestLogRepository
{
    constructor() {
        super(CartRequestLog);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterCartRequestLog, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("cartRequestLog")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestLog.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.cartRequestDrug", "cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.formulary", "cartRequestDrugFormulary")
            .leftJoinAndSelect("cartRequestLog.cartRequestPickDrug", "cartRequestPickDrug")
            .leftJoinAndSelect("cartRequestPickDrug.formulary", "cartRequestPickDrugFormulary")
            .leftJoinAndSelect("cartRequestLog.cartRequestAllocationDrug", "cartRequestAllocationDrug")
            .leftJoinAndSelect("cartRequestAllocationDrug.formulary", "cartRequestAllocationDrugFormulary")
            .withDeleted()
            .leftJoinAndSelect("cartRequestLog.cartRequestDeletionDrug", "cartRequestDeletionDrug")
            .leftJoinAndSelect("cartRequestDeletionDrug.formulary", "cartRequestDeletionDrugFormulary")
            .leftJoinAndSelect("cartRequestDrug.cartRequestDeduction", "cartRequestDeduction")
            .leftJoinAndSelect("cartRequestAllocationDrug.cartRequestDeduction", "cartRequestAllocationDeduction")
            .where("cartRequestLog.deletedAt IS NULL")
            .orderBy("cartRequestLog.id", ORDER_BY.DESC)
            .take(pagination.perPage)
            .skip(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("cartRequestLog")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestLog.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.cartRequestDrug", "cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.formulary", "cartRequestDrugFormulary")
            .leftJoinAndSelect("cartRequestLog.cartRequestPickDrug", "cartRequestPickDrug")
            .leftJoinAndSelect("cartRequestPickDrug.formulary", "cartRequestPickDrugFormulary")
            .leftJoinAndSelect("cartRequestLog.cartRequestAllocationDrug", "cartRequestAllocationDrug")
            .leftJoinAndSelect("cartRequestAllocationDrug.formulary", "cartRequestAllocationDrugFormulary")
            .withDeleted()
            .leftJoinAndSelect("cartRequestLog.cartRequestDeletionDrug", "cartRequestDeletionDrug")
            .leftJoinAndSelect("cartRequestDeletionDrug.formulary", "cartRequestDeletionDrugFormulary")
            .leftJoinAndSelect("cartRequestAllocationDrug.cartRequestDeduction", "cartRequestDeduction")
            .leftJoinAndSelect("cartRequestAllocationDrug.cartRequestDeduction", "cartRequestAllocationDeduction")
            .where("cartRequestLog.deletedAt IS NULL");

        const queryFilters = CartRequestLogQueryBuilder.setFilter(query, {...searchFilters, forRestockLog: true});
        const countFilters = CartRequestLogQueryBuilder.setFilter(countQuery, {...searchFilters, forRestockLog: true});

        const rows = await queryFilters.getMany();
        const count = await countFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchPaginatedForCartFulfilled(searchFilters: TFilterCartRequestLog, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("cartRequestLog")
            .innerJoin((qb) => {
                return qb
                    .select(["MAX(c.createdAt) AS maxDate", "c.cartId AS cartId", "c.formularyId AS formularyId"])
                    .from(CartRequestDrug, "c")
                    .groupBy("c.cartId")
                    .addGroupBy("c.formularyId")
                    .addGroupBy("c.cartRequestAllocationLogId");
            }, "cm")
            .leftJoinAndSelect(
                "cartRequestLog.cartRequestAllocationDrug",
                "cartRequestAllocationDrug",
                "cartRequestAllocationDrug.cartRequestAllocationLogId = cartRequestLog.cartRequestLogId AND cartRequestAllocationDrug.cartId = cm.cartId AND cartRequestAllocationDrug.formularyId = cm.formularyId AND cartRequestAllocationDrug.createdAt = cm.maxDate"
            )
            .leftJoinAndSelect("cartRequestAllocationDrug.formulary", "formulary")
            .leftJoinAndSelect("cartRequestAllocationDrug.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestAllocationDrug.fulfilledByAdmin", "fulfilledByAdmin")
            .limit(pagination.perPage)
            .offset(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("cartRequestLog")
            .innerJoin((qb) => {
                return qb
                    .select(["MAX(c.createdAt) AS maxDate", "c.cartId AS cartId", "c.formularyId AS formularyId"])
                    .from(CartRequestDrug, "c")
                    .groupBy("c.cartId")
                    .addGroupBy("c.formularyId")
                    .addGroupBy("c.cartRequestAllocationLogId");
            }, "cm")
            .leftJoinAndSelect(
                "cartRequestLog.cartRequestAllocationDrug",
                "cartRequestAllocationDrug",
                "cartRequestAllocationDrug.cartRequestAllocationLogId = cartRequestLog.cartRequestLogId AND cartRequestAllocationDrug.cartId = cm.cartId AND cartRequestAllocationDrug.formularyId = cm.formularyId AND cartRequestAllocationDrug.createdAt = cm.maxDate"
            )
            .leftJoinAndSelect("cartRequestAllocationDrug.formulary", "formulary")
            .leftJoinAndSelect("cartRequestAllocationDrug.cart", "cart")
            .leftJoinAndSelect("cartRequestLog.admin", "admin")
            .leftJoinAndSelect("cartRequestAllocationDrug.fulfilledByAdmin", "fulfilledByAdmin");

        const queryFilters = CartRequestLogQueryBuilder.setFilter(query, searchFilters);
        const countFilters = CartRequestLogQueryBuilder.setFilter(countQuery, searchFilters);

        const rows = await queryFilters.getMany();
        const count = await countFilters.select(["COUNT(*) AS COUNT"]).getRawOne();

        if (rows.length === 0) {
            return false;
        }

        return {count: count.count, rows: rows};
    }
}
