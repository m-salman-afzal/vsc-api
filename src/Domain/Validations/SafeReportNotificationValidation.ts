import AdminValidationSchema from "./Schemas/AdminValidationSchema";
import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {SafeReportNotificationValidationObject} from "./Schemas/SafeReportNotification";

export class SafeReportNotificationValidation {
    static getSafeReportNotificationValidation(body: unknown) {
        const getSafeReportNotification = SafeReportNotificationValidationObject.merge(AdminValidationSchema)
            .merge(PaginationValidationSchema)
            .partial({
                isArchived: true
            })
            .required({
                adminId: true,
                currentPage: true,
                perPage: true,
                facilityId: true
            });

        return getSafeReportNotification.parse(body);
    }

    static markAsReadValidation(body: unknown) {
        const getSafeReportNotification = SafeReportNotificationValidationObject.merge(AdminValidationSchema)
            .merge(PaginationValidationSchema)
            .required({
                adminId: true,
                facilityId: true,
                notificationId: true
            });

        return getSafeReportNotification.parse(body);
    }

    static markAsArchiveNotificationValidation(body: unknown) {
        const getSafeReportNotification = SafeReportNotificationValidationObject.merge(AdminValidationSchema)
            .merge(PaginationValidationSchema)
            .required({
                adminId: true,
                facilityId: true,
                notificationId: true,
                isArchived: true
            });

        return getSafeReportNotification.parse(body);
    }
}
