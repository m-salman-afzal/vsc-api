import SharedUtils from "@appUtils/SharedUtils";

export interface INotificationEntity {
    notificationId: string;
    repository: string;
    repositoryId: string;
    type: string;
    facilityId: string;
    dateTime?: string;
    notificationType?: string;
    createdAt?: string;
}

export interface NotificationEntity extends INotificationEntity {}
export class NotificationEntity {
    constructor(notification: INotificationEntity) {
        this.notificationId = notification.notificationId;
        this.repository = notification.repository;
        this.repositoryId = notification.repositoryId;
        this.type = notification.type;
        this.facilityId = notification.facilityId;
    }

    static create(notification) {
        return new NotificationEntity(notification);
    }

    static publicFields(body: NotificationEntity) {
        const notification = new NotificationEntity(body as never);
        const {date, time} = SharedUtils.setDateTime(body.createdAt as string);
        notification.dateTime = `${date} ${time}`;

        return notification;
    }

    static notificationFields(body: NotificationEntity) {
        const notification = new NotificationEntity(body as never);
        notification.notificationType = body.notificationType as string;
        const {date, time} = SharedUtils.setDateTime(body.createdAt as string);
        notification.dateTime = `${date} ${time}`;

        return notification;
    }
}
