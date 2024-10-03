import type {FacilityChecklistEntity} from "@entities/FacilityChecklist/FacilityChecklistEntity";
import type {SafeReportEntity} from "@entities/SafeReport/SafeReportEntity";
import type {ISafeReportNotificationEntity} from "@entities/SafeReportNotification/SafeReportNotificationEntity";

type IAddSafeReportNotification = Partial<ISafeReportNotificationEntity> & {
    assignees: SafeReportEntity & {facilityChecklist: FacilityChecklistEntity}[];
    reportCurrentStatus?: string;
    eventType?: string;
    safeReport: SafeReportEntity;
    isAwareness?: boolean;
};

export interface AddSafeReportNotificationDto extends IAddSafeReportNotification {}

export class AddSafeReportNotificationDto {
    constructor(body: IAddSafeReportNotification) {
        this.assignees = body.assignees ? body.assignees : (undefined as never);
        this.facilityId = body.facilityId as string;
        this.notificationType = body.notificationType as string;
        this.reportId = body.reportId as string;
        this.safeAssignmentCommentId = body.safeAssignmentCommentId as string;
        this.reportCurrentStatus = body.reportCurrentStatus as string;
        this.eventType = body.reportCurrentStatus as string;
        this.safeReport = body.assignees;
        this.reportType = body.reportType as string;
        this.isAwareness = body.isAwareness as boolean;
    }

    static create(body: IAddSafeReportNotification) {
        return new AddSafeReportNotificationDto(body);
    }
}
