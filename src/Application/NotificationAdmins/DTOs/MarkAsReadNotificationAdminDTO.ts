import type {NotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";

type IMarkAsReadNotificationAdminDTO = Pick<NotificationAdminEntity, "notificationAdminId" | "isRead">;

export interface MarkAsReadNotificationAdminDTO extends IMarkAsReadNotificationAdminDTO {}
export class MarkAsReadNotificationAdminDTO {
    constructor(body: IMarkAsReadNotificationAdminDTO) {
        this.notificationAdminId = body.notificationAdminId;
        this.isRead = body.isRead as boolean;
    }

    static create(body: unknown) {
        return new MarkAsReadNotificationAdminDTO(body as IMarkAsReadNotificationAdminDTO);
    }
}
