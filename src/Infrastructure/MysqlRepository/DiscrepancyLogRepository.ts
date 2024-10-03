import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {DiscrepancyLog} from "@infrastructure/Database/Models/DiscrepancyLog";

import {DiscrepancyLogQueryBuilder} from "./Shared/Query/DiscrepancyLogQueryBuilder";

import type {TFilterDiscrepancyLog} from "./Shared/Query/DiscrepancyLogQueryBuilder";
import type {DiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import type {IDiscrepancyLogRepository} from "@entities/DiscrepancyLog/IDiscrepancyLogRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class DiscrepancyLogRepository
    extends BaseRepository<DiscrepancyLog, DiscrepancyLogEntity>
    implements IDiscrepancyLogRepository
{
    constructor() {
        super(DiscrepancyLog);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterDiscrepancyLog, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("discrepancyLog")
            .withDeleted()
            .leftJoinAndSelect("discrepancyLog.perpetualInventory", "perpetualInventory")
            .leftJoinAndSelect("discrepancyLog.perpetualInventoryDeduction", "perpetualInventoryDeduction")
            .leftJoinAndSelect("perpetualInventoryDeduction.perpetualInventory", "perpetualInventoryFromDeduction")
            .leftJoinAndSelect("discrepancyLog.cart", "cart")
            .leftJoinAndSelect("discrepancyLog.admin", "admin")
            .where("discrepancyLog.deletedAt IS NULL")
            .orderBy("discrepancyLog.createdAt", "DESC")
            .limit(pagination.perPage)
            .offset(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("discrepancyLog")
            .leftJoinAndSelect("discrepancyLog.perpetualInventory", "perpetualInventory")
            .leftJoinAndSelect("discrepancyLog.perpetualInventoryDeduction", "perpetualInventoryDeduction")
            .leftJoinAndSelect("perpetualInventoryDeduction.perpetualInventory", "perpetualInventoryFromDeduction")
            .leftJoinAndSelect("discrepancyLog.cart", "cart");

        const queryFilters = DiscrepancyLogQueryBuilder.setFilter(query, searchFilters);
        const countFilters = DiscrepancyLogQueryBuilder.setFilter(countQuery, searchFilters);

        const count = await countFilters.getCount();
        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }
}
