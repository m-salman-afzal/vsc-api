import {BOOLEAN_VALUES} from "@appUtils/Constants";

import type {ISafeReportNotificationEntity} from "@entities/SafeReportNotification/SafeReportNotificationEntity";

type IGetSafeReportNotification = Partial<ISafeReportNotificationEntity>;

export interface GetSafeReportNotificationDto extends IGetSafeReportNotification {}

export class GetSafeReportNotificationDto {
    constructor(body: IGetSafeReportNotification) {
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
        this.isArchived = body.isArchived === (BOOLEAN_VALUES.TRUE as unknown);
    }

    static create(body: IGetSafeReportNotification) {
        return new GetSafeReportNotificationDto(body);
    }
}
