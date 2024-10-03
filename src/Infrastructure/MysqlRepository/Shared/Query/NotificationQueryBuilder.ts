import SharedUtils from "@appUtils/SharedUtils";

import type {INotificationEntity} from "@entities/Notification/NotificationEntity";
import type {INotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";
import type {Notification} from "@infrastructure/Database/Models/Notification";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterNotification = Partial<INotificationEntity> &
    Partial<INotificationAdminEntity> & {screen?: string | undefined; currentDate?: string};
type TQueryBuilderNotification = TQueryBuilder<Notification>;

export class NotificationQueryBuilder {
    private query: TQueryBuilderNotification;
    constructor(query: TQueryBuilderNotification, filters: TFilterNotification) {
        this.query = query;
        this.setFacilityId(filters);
        this.setAdminId(filters);
        this.setIsRead(filters);
        this.setIsArchived(filters);
        this.setType(filters);
        this.setNotificationId(filters);
    }

    static setFilter(query: TQueryBuilderNotification, filters) {
        return new NotificationQueryBuilder(query, filters).query;
    }

    setNotificationId(filters: TFilterNotification) {
        if (filters.notificationId) {
            this.query.andWhere("notification.notificationId = :notificationId", {
                notificationId: filters.notificationId
            });
        }
    }

    setFacilityId(filters: TFilterNotification) {
        if (filters.facilityId) {
            this.query.andWhere("notification.facilityId = :facilityId", {
                facilityId: filters.facilityId
            });
        }
    }

    setAdminId(filters: TFilterNotification) {
        if (filters.adminId) {
            this.query.andWhere("notificationAdmin.adminId = :adminId", {
                adminId: filters.adminId
            });
        }
    }

    setIsRead(filters: TFilterNotification) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isRead")) {
            this.query.andWhere("notificationAdmin.isRead = :isRead", {
                isRead: filters.isRead
            });
        }
    }

    setIsArchived(filters: TFilterNotification) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isArchived")) {
            this.query.andWhere("notificationAdmin.isArchived = :isArchived", {
                isArchived: filters.isArchived
            });
        }
    }

    setType(filters: TFilterNotification) {
        if (filters.screen === "notifications") {
            this.query.andWhere("notification.type <> :type", {
                type: "FACILITY_CHECKLIST_INCOMPLETE"
            });
        }

        if (filters.screen === "tasks") {
            this.query.andWhere("notification.type = :type", {
                type: "FACILITY_CHECKLIST_INCOMPLETE"
            });
        }
    }
}
