import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {ShiftCountLogs} from "@infrastructure/Database/Models/ShiftCountLogs";

import {ShiftCountLogsQueryBuilder} from "./Shared/Query/ShiftCountLogsQueryBuilder";

import type {TFilterShiftCountLogs} from "./Shared/Query/ShiftCountLogsQueryBuilder";
import type {IShiftCountLogRepository} from "@entities/ShiftCountLog/IShiftCountLogRepository";
import type {ShiftCountLogEntity} from "@entities/ShiftCountLog/ShiftCountLogEntity";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class ShiftCountLogRepository
    extends BaseRepository<ShiftCountLogs, ShiftCountLogEntity>
    implements IShiftCountLogRepository
{
    constructor() {
        super(ShiftCountLogs);
    }

    async fetchPaginatedWithCarts(searchFilters: TFilterShiftCountLogs, pagination: PaginationOptions) {
        const query = this.model.createQueryBuilder("shiftCountLogs").leftJoinAndSelect("shiftCountLogs.cart", "cart");
        const queryFilters = ShiftCountLogsQueryBuilder.setFilter(query, searchFilters);
        const rows = await queryFilters
            .limit(pagination.perPage)
            .offset(pagination.offset)
            .orderBy("shiftCountLogs.createdAt", "DESC")
            .getMany();
        const count = await queryFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }
}
