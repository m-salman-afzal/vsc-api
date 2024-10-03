import type {ISafeReportNotificationEntity} from "@entities/SafeReportNotification/SafeReportNotificationEntity";

type IMarkAsReadNotificationDTO = Partial<ISafeReportNotificationEntity> & {notificationId: string};

export interface MarkAsReadNotificationDTO extends IMarkAsReadNotificationDTO {}

export class MarkAsReadNotificationDTO {
    constructor(body: IMarkAsReadNotificationDTO) {
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
        this.notificationId = body.notificationId as string;
    }

    static create(body: IMarkAsReadNotificationDTO) {
        return new MarkAsReadNotificationDTO(body);
    }
}
