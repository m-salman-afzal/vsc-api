import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";
import {SEARCH_LOG_REPOSITORY_FIELDS} from "@repositories/Shared/Query/FieldsBuilder";
import LogQueryBuilder from "@repositories/Shared/Query/LogQueryBuilder";

import Log from "@infrastructure/Database/Models/Log";

import type ILogRepository from "@entities/Log/ILogRepository";
import type LogEntity from "@entities/Log/LogEntity";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
class LogRepository extends BaseRepository<Log, LogEntity> implements ILogRepository {
    constructor() {
        super(Log);
    }

    async fetchPaginatedBySearchQuery(
        searchFilters: TSearchFilters<Log> & {
            toDate?: string;
            fromDate?: string;
            text?: string;
        },
        pagination: PaginationOptions
    ) {
        const query = this.model
            .createQueryBuilder("log")
            .withDeleted()
            .leftJoin("log.admin", "admin")
            .where("1=1")
            .andWhere("log.deletedAt IS NULL")
            .limit(pagination.perPage)
            .offset(pagination.offset);

        const countQuery = this.model.createQueryBuilder("log").leftJoin("log.admin", "admin").where("1=1");

        const queryFilters = LogQueryBuilder.setFilter(query, searchFilters);
        const countFilters = LogQueryBuilder.setFilter(countQuery, searchFilters);

        const logCount = await countFilters.getCount();
        const logs = await queryFilters.select(SEARCH_LOG_REPOSITORY_FIELDS).getRawMany();

        if (logs.length === 0) {
            return false;
        }

        return {count: logCount, rows: logs};
    }
}

export default LogRepository;
