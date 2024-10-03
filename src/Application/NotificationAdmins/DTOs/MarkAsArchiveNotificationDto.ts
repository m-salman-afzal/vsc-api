import type {INotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";

type IMarkAsArchiveNotificationAdminDto = Pick<INotificationAdminEntity, "notificationAdminId" | "isArchived">;

export interface MarkAsArchiveNotificationAdminDto extends IMarkAsArchiveNotificationAdminDto {}

export class MarkAsArchiveNotificationAdminDto {
    constructor(body: IMarkAsArchiveNotificationAdminDto) {
        this.notificationAdminId = body.notificationAdminId as string;
        this.isArchived = body.isArchived as boolean;
    }

    static create(body: unknown) {
        return new MarkAsArchiveNotificationAdminDto(body as IMarkAsArchiveNotificationAdminDto);
    }
}
