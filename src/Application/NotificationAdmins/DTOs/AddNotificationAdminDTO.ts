import type {INotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";

type IAddNotificationAdmin = Pick<INotificationAdminEntity, "adminId" | "notificationId"> &
    Partial<Pick<INotificationAdminEntity, "isRead" | "isArchived">>;

export interface AddNotificationAdminDto extends IAddNotificationAdmin {}

export class AddNotificationAdminDto {
    constructor(body: IAddNotificationAdmin) {
        this.adminId = body.adminId;
        this.notificationId = body.notificationId;
        this.isArchived = body.isArchived as boolean;
        this.isRead = body.isRead as boolean;
    }

    static create(body: unknown) {
        return new AddNotificationAdminDto(body as IAddNotificationAdmin);
    }
}
