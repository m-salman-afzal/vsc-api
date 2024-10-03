import {BOOLEAN_VALUES} from "@appUtils/Constants";

import type {INotificationEntity} from "@entities/Notification/NotificationEntity";
import type {INotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";

type IGetNotification = Partial<INotificationEntity & INotificationAdminEntity & {isAlert: boolean; screen: string}>;

export interface GetNotificationDto extends IGetNotification {}

export class GetNotificationDto {
    constructor(body: IGetNotification) {
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
        this.screen = body.screen as string;
        this.isRead = (body.isRead ? body.isRead === (BOOLEAN_VALUES.TRUE as never) : null) as boolean;
        this.isArchived = (body.isArchived ? body.isArchived === (BOOLEAN_VALUES.TRUE as never) : null) as boolean;
        this.isAlert = (body.isAlert ? body.isAlert === (BOOLEAN_VALUES.TRUE as never) : null) as boolean;
    }

    static create(body: unknown) {
        return new GetNotificationDto(body as IGetNotification);
    }
}
