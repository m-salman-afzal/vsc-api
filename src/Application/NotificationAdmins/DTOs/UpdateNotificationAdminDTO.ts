import type {INotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";

type IAddNotificationAdmin = Pick<INotificationAdminEntity, "adminId" | "notificationId"> &
    Pick<INotificationAdminEntity, "notificationAdminId"> &
    Partial<Pick<INotificationAdminEntity, "notificationAdminId" | "isRead" | "isArchived">>;

export interface UpdateNotificationAdminDto extends IAddNotificationAdmin {}

export class UpdateNotificationAdminDto {
    constructor(body: IAddNotificationAdmin) {
        this.notificationAdminId = body.notificationAdminId;
        this.isArchived = body.isArchived as boolean;
        this.isRead = body.isRead as boolean;
    }

    static create(body: unknown) {
        return new UpdateNotificationAdminDto(body as IAddNotificationAdmin);
    }
}
