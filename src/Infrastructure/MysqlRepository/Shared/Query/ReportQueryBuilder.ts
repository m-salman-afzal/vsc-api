import {Brackets} from "typeorm";

import {SAFE_REPORT_STATUS} from "@constants/ReportConstant";

import SharedUtils from "@appUtils/SharedUtils";

import type {IReportEntity} from "@entities/Report/ReportEntity";
import type {Report} from "@infrastructure/Database/Models/Report";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterReport = Omit<Partial<IReportEntity>, "status" | "reportId"> & {
    toDate?: string | undefined;
    fromDate?: string | undefined;
    isNotPending?: boolean | undefined;
    text?: string | undefined;
    investigationAdminId?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    status?: string | string[] | undefined;
    reportId?: string | string[] | undefined;
};

type TQueryBuilderReport = TQueryBuilder<Report>;

export class ReportQueryBuilder {
    private query: TQueryBuilderReport;
    constructor(query: TQueryBuilderReport, filters: TFilterReport) {
        this.query = query;

        this.setReportId(filters);
        this.setReportType(filters);
        this.setCreatedAt(filters);
        this.setFacilityId(filters);
        this.setIsNotPending(filters);
        this.setName(filters);
        this.setFirstName(filters);
        this.setLastName(filters);
        this.setStatus(filters);
        this.setAdminId(filters);
        this.setInvestigationAdminId(filters);
        this.setIsAnonymous(filters);
    }

    static setFilter(query: TQueryBuilderReport, filters: TFilterReport) {
        return new ReportQueryBuilder(query, filters).query;
    }

    setAdminId(filters: TFilterReport) {
        if (filters.adminId) {
            this.query.andWhere("report.adminId = :adminId", {adminId: filters.adminId});
        }
    }

    setIsAnonymous(filters: TFilterReport) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isAnonymous")) {
            this.query.andWhere("report.isAnonymous = :isAnonymous", {isAnonymous: filters.isAnonymous});
        }
    }

    setName(filters: TFilterReport) {
        if (filters.text) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("admin.firstName LIKE :text", {text: `%${filters.text}%`});
                    qb.orWhere("admin.lastName LIKE :text", {text: `%${filters.text}%`});
                })
            );
        }
    }

    setFirstName(filters: TFilterReport) {
        if (filters.firstName) {
            this.query.andWhere("admin.firstName LIKE :firstName", {firstName: `%${filters.firstName}%`});
        }
    }

    setLastName(filters: TFilterReport) {
        if (filters.lastName) {
            this.query.andWhere("admin.lastName LIKE :lastName", {lastName: `%${filters.lastName}%`});
        }
    }

    setReportId(filters: TFilterReport) {
        if (Array.isArray(filters.reportId)) {
            this.query.andWhere("report.reportId IN (:...reportId)", {reportId: filters.reportId});

            return;
        }

        if (filters.reportId) {
            this.query.andWhere("report.reportId = :reportId", {reportId: filters.reportId});
        }
    }

    setReportType(filters: TFilterReport) {
        if (filters.type) {
            this.query.andWhere("report.type = :type", {type: filters.type});
        }
    }

    setStatus(filters: TFilterReport) {
        if (Array.isArray(filters.status)) {
            this.query.andWhere("report.status IN (:...status)", {status: filters.status});

            return;
        }

        if (filters.status) {
            this.query.andWhere("report.status = :status", {status: filters.status});
        }
    }

    setCreatedAt(filters: TFilterReport) {
        if (filters.toDate && filters.fromDate) {
            this.query.andWhere("report.createdAt BETWEEN :fromDate AND :toDate", {
                fromDate: `${filters.fromDate}  00:00:00`,
                toDate: `${filters.toDate} 23:59:59`
            });
        }
    }

    setIsNotPending(filters: TFilterReport) {
        if (filters.isNotPending) {
            this.query.andWhere("report.status != :status", {
                status: SAFE_REPORT_STATUS.PENDING
            });
        }
    }

    setFacilityId(filters: TFilterReport) {
        if (Array.isArray(filters.facilityId)) {
            this.query.andWhere("facility.facilityId IN (:...facilityId)", {facilityId: filters.facilityId});

            return;
        }

        if (filters.facilityId) {
            this.query.andWhere("facility.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    setInvestigationAdminId(filters: TFilterReport) {
        if (filters.investigationAdminId) {
            this.query.andWhere("facilityChecklist.adminId = :investigationAdminId", {
                investigationAdminId: filters.investigationAdminId
            });
        }
    }
}
