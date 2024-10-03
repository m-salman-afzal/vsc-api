import {injectable} from "tsyringe";

import {AuditLog} from "@infrastructure/Database/Models/AuditLog";

import BaseRepository from "./BaseRepository";
import {AuditLogQueryFilter} from "./Shared/Query/AuditLogQueryFilter";

import type {AuditLogEntity} from "@entities/AuditLog/AuditLogEntity";
import type {IAuditLogRepository, TOrder} from "@entities/AuditLog/IAuditLogRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class AuditLogRepository extends BaseRepository<AuditLog, AuditLogEntity> implements IAuditLogRepository {
    constructor() {
        super(AuditLog);
    }

    async fetchPaginatedWithAdminFacility(
        searchFilters: TSearchFilters<AuditLog>,
        pagination: PaginationOptions,
        order?: TOrder
    ) {
        const query = this.model
            .createQueryBuilder("auditLog")
            .withDeleted()
            .leftJoinAndSelect("auditLog.facility", "facility")
            .leftJoinAndSelect("auditLog.admin", "admin")
            .leftJoinAndSelect("admin.adminRole", "adminRole")
            .leftJoinAndSelect("adminRole.role", "role");

        const countQuery = this.model.createQueryBuilder("auditLog");

        const queryFilters = AuditLogQueryFilter.setFilter(query, searchFilters);
        const countFilters = AuditLogQueryFilter.setFilter(countQuery, searchFilters);

        const count = await countFilters.getCount();
        const rows = await queryFilters
            .orderBy("auditLog.id", order ?? "DESC")
            .take(pagination.perPage)
            .skip(pagination.offset)
            .getMany();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }
}
