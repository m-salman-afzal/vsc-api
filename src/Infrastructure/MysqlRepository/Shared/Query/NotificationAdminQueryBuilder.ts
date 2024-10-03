import type {INotificationEntity} from "@entities/Notification/NotificationEntity";
import type {INotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";
import type {NotificationAdmin} from "@infrastructure/Database/Models/NotificationAdmin";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterNotificationAdmin = Partial<INotificationEntity> & Partial<INotificationAdminEntity>;
type TQueryBuilderNotification = TQueryBuilder<NotificationAdmin>;

export class NotificationAdminQueryBuilder {
    private query: TQueryBuilderNotification;
    constructor(query: TQueryBuilderNotification, filters: TFilterNotificationAdmin) {
        this.query = query;
        this.setFacilityId(filters);
        this.setAdminId(filters);
        this.setNotificationId(filters);
    }

    static setFilter(query: TQueryBuilderNotification, filters) {
        return new NotificationAdminQueryBuilder(query, filters).query;
    }

    setNotificationId(filters: TFilterNotificationAdmin) {
        if (filters.notificationId) {
            this.query.andWhere("notification.notificationId = :notificationId", {
                notificationId: filters.notificationId
            });
        }
    }

    setFacilityId(filters: TFilterNotificationAdmin) {
        if (filters.facilityId) {
            this.query.andWhere("notification.facilityId = :facilityId", {
                facilityId: filters.facilityId
            });
        }
    }

    setAdminId(filters: TFilterNotificationAdmin) {
        if (filters.adminId) {
            this.query.andWhere("notificationAdmin.adminId = :adminId", {
                adminId: filters.adminId
            });
        }
    }
}
