import type {ISafeReportNotificationEntity} from "@entities/SafeReportNotification/SafeReportNotificationEntity";
import type {SafeReportNotification} from "@infrastructure/Database/Models/SafeReportNotification";
import type {TQueryBuilder} from "@typings/ORM";

type TFilterSafeReportNotification = Partial<ISafeReportNotificationEntity>;
type TQueryBuilderSafeReportNotification = TQueryBuilder<SafeReportNotification>;

export class SafeReportNotificationFilter {
    private query: TQueryBuilderSafeReportNotification;
    constructor(query: TQueryBuilderSafeReportNotification, filters: TFilterSafeReportNotification) {
        this.query = query;
        this.setFacilityId(filters);
        this.setAdminId(filters);
        this.setArchivedStatus(filters);
    }

    static setFilter(query: TQueryBuilderSafeReportNotification, filters) {
        return new SafeReportNotificationFilter(query, filters).query;
    }

    setAdminId(filters: TFilterSafeReportNotification) {
        if (filters.adminId) {
            this.query.andWhere("safeReportNotification.adminId = :adminId", {
                adminId: filters.adminId
            });
        }
    }

    setFacilityId(filters: TFilterSafeReportNotification) {
        if (filters.facilityId) {
            this.query.andWhere("safeReportNotification.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    setArchivedStatus(filters: TFilterSafeReportNotification) {
        if (filters.isArchived !== undefined) {
            this.query.andWhere("safeReportNotification.isArchived = :isArchived", {isArchived: filters.isArchived});
        }
    }
}
