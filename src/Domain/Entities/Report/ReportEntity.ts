import SharedUtils from "@appUtils/SharedUtils";

import type {Report} from "@infrastructure/Database/Models/Report";

export interface IReportEntity {
    reportId: string;
    status: string;
    isAnonymous: boolean;
    type: string;
    description: string;
    adminId: string;
    closedByAdminId: string;
    facilityId: string;
    safeReportId: string;
    reportType?: string;
    createdAt?: string;
}

export interface ReportEntity extends IReportEntity {}

export class ReportEntity {
    constructor(body: IReportEntity) {
        this.reportId = body.reportId;
        this.status = body.status;
        this.isAnonymous = body.isAnonymous;
        this.type = body.type;
        this.description = body.description ? body.description.trim() : body.description;
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;
        this.safeReportId = body.safeReportId;
        this.closedByAdminId = body.closedByAdminId;
    }

    static create(body: unknown) {
        return new ReportEntity(body as IReportEntity);
    }

    static publicFields(body: Report) {
        const report = new ReportEntity(body as never);
        const {date, time} = SharedUtils.setDateTime(body.createdAt);
        report.createdAt = `${date} ${time}`;

        return report;
    }

    static notificationFields(body: ReportEntity) {
        const report = new ReportEntity(body as never);
        report.reportType = body.reportType as string;

        return report;
    }
}
