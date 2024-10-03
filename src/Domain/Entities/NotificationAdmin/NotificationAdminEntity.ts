export interface INotificationAdminEntity {
    notificationAdminId: string;
    notificationId: string;
    adminId: string;
    isRead: boolean;
    isArchived: boolean;
}

export interface NotificationAdminEntity extends INotificationAdminEntity {}

export class NotificationAdminEntity {
    constructor(notificationAdmin: INotificationAdminEntity) {
        this.notificationAdminId = notificationAdmin.notificationAdminId;
        this.notificationId = notificationAdmin.notificationId;
        this.adminId = notificationAdmin.adminId;
        this.isRead = notificationAdmin.isRead;
        this.isArchived = notificationAdmin.isArchived;
    }

    static create(notificationAdmin) {
        return new NotificationAdminEntity(notificationAdmin);
    }
}
