import {BOOLEAN_VALUES} from "@appUtils/Constants";

import type {INotificationEntity} from "@entities/Notification/NotificationEntity";
import type {INotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";

type IGetNotificationAdmin = Partial<INotificationAdminEntity> & Partial<INotificationEntity>;

export interface GetNotificationAdminDto extends IGetNotificationAdmin {}

export class GetNotificationAdminDto {
    constructor(body: IGetNotificationAdmin) {
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
        this.isArchived = (body.isArchived ? body.isArchived === (BOOLEAN_VALUES.TRUE as never) : null) as boolean;
    }

    static create(body: unknown) {
        return new GetNotificationAdminDto(body as IGetNotificationAdmin);
    }
}
