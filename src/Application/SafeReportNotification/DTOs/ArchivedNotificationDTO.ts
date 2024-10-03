import type {ISafeReportNotificationEntity} from "@entities/SafeReportNotification/SafeReportNotificationEntity";

type ImarkAsArchiveNotificationDto = Partial<ISafeReportNotificationEntity> & {notificationId: string};

export interface markAsArchiveNotificationDto extends ImarkAsArchiveNotificationDto {}

export class markAsArchiveNotificationDto {
    constructor(body: ImarkAsArchiveNotificationDto) {
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
        this.notificationId = body.notificationId as string;
        this.isArchived = body.isArchived as boolean;
    }

    static create(body: ImarkAsArchiveNotificationDto) {
        return new markAsArchiveNotificationDto(body);
    }
}
