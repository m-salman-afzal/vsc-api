import {injectable} from "tsyringe";

import {ORDER_BY} from "@appUtils/Constants";

import BaseRepository from "@repositories/BaseRepository";

import {Report} from "@infrastructure/Database/Models/Report";

import {ReportQueryBuilder} from "./Shared/Query/ReportQueryBuilder";

import type {TFilterReport} from "./Shared/Query/ReportQueryBuilder";
import type {IReportRepository} from "@entities/Report/IReportRepository";
import type {ReportEntity} from "@entities/Report/ReportEntity";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class ReportRepository extends BaseRepository<Report, ReportEntity> implements IReportRepository {
    constructor() {
        super(Report);
    }

    async fetchPaginatedWithAdmins(searchFilters: TFilterReport, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("report")
            .leftJoinAndSelect("report.safeReport", "safeReport")
            .leftJoinAndSelect("safeReport.safeFacilityChecklist", "safeFacilityChecklist")
            .leftJoinAndSelect("safeFacilityChecklist.facilityChecklist", "facilityChecklist")
            .leftJoinAndSelect("facilityChecklist.admin", "admin1")
            .leftJoinAndSelect("report.facility", "facility")
            .withDeleted()
            .leftJoinAndSelect("report.admin", "admin")
            .andWhere("report.deletedAt IS NULL")
            .orderBy("report.id", ORDER_BY.DESC);

        const countQuery = this.model
            .createQueryBuilder("report")
            .leftJoinAndSelect("report.facility", "facility")
            .leftJoinAndSelect("report.safeReport", "safeReport")
            .leftJoinAndSelect("safeReport.safeFacilityChecklist", "safeFacilityChecklist")
            .leftJoinAndSelect("safeFacilityChecklist.facilityChecklist", "facilityChecklist")
            .leftJoinAndSelect("facilityChecklist.admin", "admin1")
            .withDeleted()
            .leftJoinAndSelect("report.admin", "admin")
            .andWhere("report.deletedAt IS NULL");

        const queryFilters = ReportQueryBuilder.setFilter(query, searchFilters);
        const countFilters = ReportQueryBuilder.setFilter(countQuery, searchFilters);

        const rows = await queryFilters.take(pagination.perPage).skip(pagination.offset).getMany();
        const count = await countFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchWithAdmins(searchFilters: TFilterReport) {
        const query = this.model
            .createQueryBuilder("report")
            .leftJoinAndSelect("report.safeReport", "safeReport")
            .leftJoinAndSelect("report.facility", "facility")
            .leftJoinAndSelect("report.closedByAdmin", "closedByAdmin")
            .leftJoinAndSelect("safeReport.safeFacilityChecklist", "safeFacilityChecklist")
            .leftJoinAndSelect("safeFacilityChecklist.facilityChecklist", "facilityChecklist")
            .leftJoinAndSelect("facilityChecklist.admin", "admin1")
            .leftJoinAndSelect("safeReport.safeAssignmentComment", "safeAssignmentComment")
            .leftJoinAndSelect("safeAssignmentComment.admin", "admin2")
            .leftJoinAndSelect("safeReport.safeReportEventLocation", "safeReportEventLocation")
            .leftJoinAndSelect("safeReportEventLocation.safeEventLocation", "safeEventLoction")
            .withDeleted()
            .leftJoinAndSelect("report.admin", "admin")
            .andWhere("report.deletedAt IS NULL");

        const queryFilters = ReportQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getOne();

        if (!rows) {
            return false;
        }

        return rows;
    }

    async fetchWithAssignees(searchFilters: TFilterReport) {
        const query = this.model
            .createQueryBuilder("report")
            .leftJoinAndSelect("report.safeReport", "safeReport")
            .leftJoinAndSelect("safeReport.safeFacilityChecklist", "safeFacilityChecklist")
            .leftJoinAndSelect("safeFacilityChecklist.facilityChecklist", "facilityChecklist")
            .leftJoinAndSelect("facilityChecklist.admin", "admin");

        const queryFilters = ReportQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }
}
