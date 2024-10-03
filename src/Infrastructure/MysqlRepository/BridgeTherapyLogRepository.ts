import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {BridgeTherapyLog} from "@infrastructure/Database/Models/BridgeTherapyLog";

import {BridgeTherapyLogQueryBuilder} from "./Shared/Query/BridgeTherapyLogQueryBuilder";
import {SEARCH_BRIDGE_THERAPY_LOG_REPOSITORY_FIELDS} from "./Shared/Query/FieldsBuilder";

import type {TOrder} from "@entities/AuditLog/IAuditLogRepository";
import type {BridgeTherapyLogEntity} from "@entities/BridgeTherapyLog/BridgeTherapyLogEntity";
import type IBridgeTherapyLogRepository from "@entities/BridgeTherapyLog/IBridgeTherapyLogRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class BridgeTherapyLogRepository
    extends BaseRepository<BridgeTherapyLog, BridgeTherapyLogEntity>
    implements IBridgeTherapyLogRepository
{
    constructor() {
        super(BridgeTherapyLog);
    }

    async fetchPaginatedBySearchQuery(
        searchFilters: TSearchFilters<BridgeTherapyLog>,
        pagination: PaginationOptions,
        order?: TOrder
    ) {
        const query = this.model
            .createQueryBuilder("bridgeTherapyLog")
            .leftJoin("bridgeTherapyLog.admin", "admin")
            .leftJoin("bridgeTherapyLog.facility", "facility")
            .where("1=1")
            .limit(pagination.perPage)
            .offset(pagination.offset)
            .orderBy("bridgeTherapyLog.id", order ?? "DESC");

        const countQuery = this.model
            .createQueryBuilder("bridgeTherapyLog")
            .leftJoin("bridgeTherapyLog.admin", "admin")
            .leftJoin("bridgeTherapyLog.facility", "facility")
            .where("1=1");

        const queryFilters = BridgeTherapyLogQueryBuilder.setFilter(query, searchFilters);
        const countFilters = BridgeTherapyLogQueryBuilder.setFilter(countQuery, searchFilters);

        const bridgeTherapyLogCount = await countFilters.getCount();
        const bridgeTherapyLogs = await queryFilters.select(SEARCH_BRIDGE_THERAPY_LOG_REPOSITORY_FIELDS).getRawMany();
        if (bridgeTherapyLogs.length === 0) {
            return false;
        }

        return {count: bridgeTherapyLogCount, rows: bridgeTherapyLogs};
    }
}
