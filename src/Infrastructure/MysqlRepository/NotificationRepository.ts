import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {Notification} from "@infrastructure/Database/Models/Notification";

import {SEARCH_NOTIFICATION_FIELDS} from "./Shared/Query/FieldsBuilder";
import {NotificationQueryBuilder} from "./Shared/Query/NotificationQueryBuilder";

import type {TFilterNotification} from "./Shared/Query/NotificationQueryBuilder";
import type {INotificationRepository, TOrder} from "@entities/Notification/INotificationRepository";
import type {NotificationEntity} from "@entities/Notification/NotificationEntity";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class NotificationRepository
    extends BaseRepository<Notification, NotificationEntity>
    implements INotificationRepository
{
    constructor() {
        super(Notification);
    }

    async getFacilities(searchFilters: TFilterNotification): Promise<any[] | false> {
        const query = this.model
            .createQueryBuilder("notification")
            .innerJoin("notification.notificationAdmin", "notificationAdmin")
            .leftJoin("notification.facility", "facility")
            .withDeleted()
            .leftJoin(
                "facility.facilityAdmin",
                "facilityAdmin",
                "facilityAdmin.facilityId = :facilityId AND facilityAdmin.adminId = :adminId",
                {
                    facilityId: searchFilters.facilityId,
                    adminId: searchFilters.adminId
                }
            )
            .andWhere("facilityAdmin.deletedAt IS NULL");

        const queryFilters = NotificationQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters
            .select(["DISTINCT (facility.facilityId) AS facilityId", "facility.facilityName AS facilityName"])
            .getRawMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchNotificationWithAdmin(searchFilters: TFilterNotification): Promise<Notification | false> {
        const query = this.model
            .createQueryBuilder("notification")
            .innerJoinAndSelect("notification.notificationAdmin", "notificationAdmin");

        const queryFilters = NotificationQueryBuilder.setFilter(query, searchFilters);

        const result = await queryFilters.orderBy("notificationAdmin.id", "DESC").getOne();

        if (!result) {
            return false;
        }

        return result;
    }

    async fetchNotificationWithAdminAndRepository(searchFilters: TFilterNotification): Promise<Notification | false> {
        const query = this.model
            .createQueryBuilder("notification")
            .leftJoin("notification.notificationAdmin", "notificationAdmin")
            .leftJoin("notification.facility", "facility")
            .withDeleted()
            .leftJoin(
                "facility.facilityAdmin",
                "facilityAdmin",
                "facilityAdmin.facilityId = :facilityId AND facilityAdmin.adminId = :adminId",
                {
                    facilityId: searchFilters.facilityId,
                    adminId: searchFilters.adminId
                }
            )
            .leftJoin(
                "SafeAssignmentComments",
                "safeAssignmentComment",
                "notification.repository = 'SAFE_ASSIGNMENT_COMMENT' AND safeAssignmentComment.safeAssignmentCommentId = notification.repositoryId"
            )
            .leftJoin("safeAssignmentComment.admin", "admin")
            .leftJoin(
                "SafeReports",
                "safeReport",
                "((notification.repository = 'SAFE_REPORT' AND safeReport.safeReportId = notification.repositoryId) OR (notification.repository = 'SAFE_ASSIGNMENT_COMMENT' AND safeReport.safeReportId = safeAssignmentComment.safeReportId))"
            )
            .leftJoin("safeReport.report", "report")
            .leftJoin(
                "ControlledDrugs",
                "controlledDrug",
                "notification.repository = 'CONTROLLED_DRUG' AND controlledDrug.controlledDrugId = notification.repositoryId"
            )
            .leftJoin(
                "Inventory",
                "inventory",
                "notification.repository = 'CONTROLLED_DRUG' AND inventory.inventoryId = controlledDrug.inventoryId"
            )
            .leftJoin(
                "Formulary",
                "formulary",
                "(notification.repository = 'FORMULARY' OR notification.repository = 'CONTROLLED_DRUG') AND (formulary.formularyId = notification.repositoryId OR formulary.formularyId = inventory.formularyId)"
            )
            .leftJoin(
                "ShiftCountLogs",
                "shiftCountLogs",
                "notification.repository = 'SHIFT_COUNT_LOGS' AND shiftCountLogs.shiftCountLogId = notification.repositoryId"
            )
            .leftJoin("Carts", "cart", "cart.cartId = shiftCountLogs.cartId")
            .where("safeAssignmentComment.deletedAt IS NULL")
            .andWhere("safeReport.deletedAt IS NULL")
            .andWhere("report.deletedAt IS NULL")
            .andWhere("formulary.deletedAt IS NULL")
            .andWhere("facilityAdmin.deletedAt IS NULL")
            .andWhere("shiftCountLogs.deletedAt IS NULL");

        const queryFilters = NotificationQueryBuilder.setFilter(query, searchFilters);

        const result = await queryFilters.select(SEARCH_NOTIFICATION_FIELDS).getRawOne();
        if (!result) {
            return false;
        }

        return result;
    }

    async fetchPaginatedNotificationsWithAdminAndRepository(
        searchFilters: TFilterNotification,
        pagination: PaginationOptions,
        order?: TOrder
    ): Promise<
        | {
              count: number;
              rows: Notification[];
          }
        | false
    > {
        const query = this.model
            .createQueryBuilder("notification")
            .innerJoin("notification.notificationAdmin", "notificationAdmin")
            .leftJoin("notification.facility", "facility")
            .withDeleted()
            .leftJoin(
                "facility.facilityAdmin",
                "facilityAdmin",
                "facilityAdmin.facilityId = :facilityId AND facilityAdmin.adminId = :adminId",
                {
                    facilityId: searchFilters.facilityId,
                    adminId: searchFilters.adminId
                }
            )
            .leftJoin(
                "SafeAssignmentComments",
                "safeAssignmentComment",
                "notification.repository = 'SAFE_ASSIGNMENT_COMMENT' AND safeAssignmentComment.safeAssignmentCommentId = notification.repositoryId"
            )
            .leftJoin("safeAssignmentComment.admin", "admin")
            .leftJoin(
                "SafeReports",
                "safeReport",
                "((notification.repository = 'SAFE_REPORT' AND safeReport.safeReportId = notification.repositoryId) OR (notification.repository = 'SAFE_ASSIGNMENT_COMMENT' AND safeReport.safeReportId = safeAssignmentComment.safeReportId))"
            )
            .leftJoin("safeReport.report", "report")
            .leftJoin(
                "ControlledDrugs",
                "controlledDrug",
                "notification.repository = 'CONTROLLED_DRUG' AND controlledDrug.controlledDrugId = notification.repositoryId"
            )
            .leftJoin(
                "Inventory",
                "inventory",
                "notification.repository = 'CONTROLLED_DRUG' AND inventory.inventoryId = controlledDrug.inventoryId"
            )
            .leftJoin(
                "Formulary",
                "formulary",
                "(notification.repository = 'FORMULARY' OR notification.repository = 'CONTROLLED_DRUG') AND (formulary.formularyId = notification.repositoryId OR formulary.formularyId = inventory.formularyId)"
            )
            .leftJoin(
                "ShiftCountLogs",
                "shiftCountLogs",
                "notification.repository = 'SHIFT_COUNT_LOG' AND shiftCountLogs.shiftCountLogId = notification.repositoryId"
            )
            .leftJoin("Carts", "cart", "cart.cartId = shiftCountLogs.cartId")
            .where("safeAssignmentComment.deletedAt IS NULL")
            .andWhere("safeReport.deletedAt IS NULL")
            .andWhere("report.deletedAt IS NULL")
            .andWhere("formulary.deletedAt IS NULL")
            .andWhere("facilityAdmin.deletedAt IS NULL")
            .andWhere("shiftCountLogs.deletedAt IS NULL");

        const countQuery = this.model
            .createQueryBuilder("notification")
            .leftJoin("notification.notificationAdmin", "notificationAdmin")
            .leftJoin("notification.facility", "facility")
            .withDeleted()
            .leftJoin(
                "facility.facilityAdmin",
                "facilityAdmin",
                "facilityAdmin.facilityId = :facilityId AND facilityAdmin.adminId = :adminId",
                {
                    facilityId: searchFilters.facilityId,
                    adminId: searchFilters.adminId
                }
            )
            .leftJoin(
                "SafeAssignmentComments",
                "safeAssignmentComment",
                "safeAssignmentComment.safeAssignmentCommentId = notification.repositoryId"
            )
            .leftJoin("safeAssignmentComment.admin", "admin")
            .leftJoin(
                "SafeReports",
                "safeReport",
                "((safeReport.safeReportId = notification.repositoryId) OR (safeReport.safeReportId = safeAssignmentComment.safeReportId))"
            )
            .leftJoin("safeReport.report", "report")
            .leftJoin(
                "ControlledDrugs",
                "controlledDrug",
                "controlledDrug.controlledDrugId = notification.repositoryId"
            )
            .leftJoin("Inventory", "inventory", "inventory.inventoryId = controlledDrug.inventoryId")
            .leftJoin(
                "Formulary",
                "formulary",
                "(formulary.formularyId = notification.repositoryId OR formulary.formularyId = inventory.formularyId)"
            )
            .leftJoin(
                "ShiftCountLogs",
                "shiftCountLogs",
                "notification.repository = 'SHIFT_COUNT_LOGS' AND shiftCountLogs.shiftCountLogId = notification.repositoryId"
            )
            .leftJoin("Carts", "cart", "cart.cartId = shiftCountLogs.cartId")
            .where("safeAssignmentComment.deletedAt IS NULL")
            .andWhere("safeReport.deletedAt IS NULL")
            .andWhere("report.deletedAt IS NULL")
            .andWhere("formulary.deletedAt IS NULL")
            .andWhere("facilityAdmin.deletedAt IS NULL")
            .andWhere("shiftCountLogs.deletedAt IS NULL");

        const queryFilters = NotificationQueryBuilder.setFilter(query, searchFilters);
        const countFilters = NotificationQueryBuilder.setFilter(countQuery, searchFilters);

        const count = await countFilters.getCount();
        const rows = await queryFilters
            .select(SEARCH_NOTIFICATION_FIELDS)
            .orderBy("notification.id", order ?? "DESC")
            .limit(pagination.perPage)
            .offset(pagination.offset)
            .getRawMany();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchNotificationsWithAdminAndRepositoryCount(searchFilters: TFilterNotification): Promise<{
        count: number;
    }> {
        const countQuery = this.model
            .createQueryBuilder("notification")
            .leftJoin("notification.notificationAdmin", "notificationAdmin")
            .leftJoin("notification.facility", "facility")
            .withDeleted()
            .leftJoin(
                "facility.facilityAdmin",
                "facilityAdmin",
                "facilityAdmin.facilityId = :facilityId AND facilityAdmin.adminId = :adminId",
                {
                    facilityId: searchFilters.facilityId,
                    adminId: searchFilters.adminId
                }
            )
            .leftJoin(
                "SafeAssignmentComments",
                "safeAssignmentComment",
                "safeAssignmentComment.safeAssignmentCommentId = notification.repositoryId"
            )
            .leftJoin("safeAssignmentComment.admin", "admin")
            .leftJoin(
                "SafeReports",
                "safeReport",
                "((safeReport.safeReportId = notification.repositoryId) OR (safeReport.safeReportId = safeAssignmentComment.safeReportId))"
            )
            .leftJoin("safeReport.report", "report")
            .leftJoin(
                "ControlledDrugs",
                "controlledDrug",
                "controlledDrug.controlledDrugId = notification.repositoryId"
            )
            .leftJoin("Inventory", "inventory", "inventory.inventoryId = controlledDrug.inventoryId")
            .leftJoin(
                "Formulary",
                "formulary",
                "(formulary.formularyId = notification.repositoryId OR formulary.formularyId = inventory.formularyId)"
            )
            .leftJoin(
                "ShiftCountLogs",
                "shiftCountLogs",
                "notification.repository = 'SHIFT_COUNT_LOGS' AND shiftCountLogs.shiftCountLogId = notification.repositoryId"
            )
            .leftJoin("Carts", "cart", "cart.cartId = shiftCountLogs.cartId")
            .where("safeAssignmentComment.deletedAt IS NULL")
            .andWhere("safeReport.deletedAt IS NULL")
            .andWhere("report.deletedAt IS NULL")
            .andWhere("formulary.deletedAt IS NULL")
            .andWhere("facilityAdmin.deletedAt IS NULL")
            .andWhere("shiftCountLogs.deletedAt IS NULL");

        const countFilters = NotificationQueryBuilder.setFilter(countQuery, searchFilters);

        const count = await countFilters.getCount();

        return {count: count};
    }
}
