import SharedUtils from "@appUtils/SharedUtils";

export interface ISafeReportNotificationEntity {
    notificationId: string;
    notificationType: string;
    adminId: string;
    facilityId: string;
    reportId: string;
    safeAssignmentCommentId: string;
    dateTime?: string;
    createdAt?: Date;
    reportType?: string;
    isRead: boolean;
    isArchived: boolean;
}

export interface SafeReportNotificationEntity extends ISafeReportNotificationEntity {}
export class SafeReportNotificationEntity {
    constructor(safeReportNotification: ISafeReportNotificationEntity) {
        this.notificationId = safeReportNotification.notificationId as string;
        this.adminId = safeReportNotification.adminId as string;
        this.facilityId = safeReportNotification.facilityId as string;
        this.notificationType = safeReportNotification.notificationType as string;
        this.reportId = safeReportNotification.reportId as string;
        this.safeAssignmentCommentId = safeReportNotification.safeAssignmentCommentId as string;
        this.reportType = safeReportNotification.reportType as string;
        this.isRead = safeReportNotification.isRead;
        this.isArchived = safeReportNotification.isArchived;
    }

    static create(safeReportNotification) {
        return new SafeReportNotificationEntity(safeReportNotification);
    }

    static publicFields(body: SafeReportNotificationEntity) {
        const notification = new SafeReportNotificationEntity(body as never);
        const {date, time} = SharedUtils.setDateTime(body.createdAt as Date);
        notification.dateTime = `${date} ${time}`;

        return notification;
    }
}
