import AdminValidationSchema from "./Schemas/AdminValidationSchema";
import {NotificationAdminValidationObject} from "./Schemas/NotificationAdminSchema";
import {NotificationValidationObject} from "./Schemas/NotificationSchema";
import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

export class NotificationValidation {
    static getFacilitiesValidation(body: unknown) {
        const getNotification = NotificationValidationObject.merge(AdminValidationSchema)
            .partial({
                isArchived: true
            })
            .required({
                adminId: true
            });

        return getNotification.parse(body);
    }

    static getNotificationValidation(body: unknown) {
        const getNotification = NotificationValidationObject.merge(AdminValidationSchema)
            .merge(PaginationValidationSchema)
            .partial({
                isArchived: true,
                facilityId: true,
                screen: true
            })
            .required({
                isAlert: true,
                adminId: true,
                currentPage: true,
                perPage: true
            });

        return getNotification.parse(body);
    }

    static markAsReadValidation(body: unknown) {
        const getNotification = NotificationAdminValidationObject.required({
            notificationAdminId: true,
            isRead: true
        });

        return getNotification.parse(body);
    }

    static markAsArchiveNotificationValidation(body: unknown) {
        const getNotification = NotificationAdminValidationObject.required({
            notificationAdminId: true,
            isArchived: true
        });

        return getNotification.parse(body);
    }
}
