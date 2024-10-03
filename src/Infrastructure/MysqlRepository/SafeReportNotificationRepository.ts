import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {SafeReportNotification} from "@infrastructure/Database/Models/SafeReportNotification";

import {SafeReportNotificationFilter} from "./Shared/Query/SafeReportNotificationQueryBuilder";

import type {ISafeReportNotificationRepository} from "@entities/SafeReportNotification/ISafeReportNotificationRepository";
import type {SafeReportNotificationEntity} from "@entities/SafeReportNotification/SafeReportNotificationEntity";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class SafeReportNotificationRepository
    extends BaseRepository<SafeReportNotification, SafeReportNotificationEntity>
    implements ISafeReportNotificationRepository
{
    constructor() {
        super(SafeReportNotification);
    }

    async fetchPaginatedWithComment(
        searchFilters: TSearchFilters<SafeReportNotification>,
        pagination: PaginationOptions,
        order?: "ASC" | "DESC"
    ) {
        const query = this.model
            .createQueryBuilder("safeReportNotification")
            .leftJoinAndSelect("safeReportNotification.safeAssignmentComment", "comment")
            .leftJoinAndSelect("comment.admin", "admin");

        const countQuery = this.model.createQueryBuilder("safeReportNotification");

        const queryFilters = SafeReportNotificationFilter.setFilter(query, searchFilters);
        const countFilters = SafeReportNotificationFilter.setFilter(countQuery, searchFilters);

        const count = await countFilters.getCount();
        const rows = await queryFilters
            .orderBy("safeReportNotification.id", order ?? "DESC")
            .take(pagination.perPage)
            .skip(pagination.offset)
            .getMany();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }
}
