import async from "async";
import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {ReportEntity} from "@entities/Report/ReportEntity";
import {SafeAssignmentCommentEntity} from "@entities/SafeAssignmentComment/SafeAssignmentCommentEntity";
import {SafeEventLocationEntity} from "@entities/SafeEventLocation/SafeEventLocationEntity";
import {SafeReportEntity} from "@entities/SafeReport/SafeReportEntity";
import {SafeReportEventLocationEntity} from "@entities/SafeReportEventLocation/SafeReportEventLocationEntity";

import {FACILITY_CHECKLIST_EVENTS} from "@constants/FacilityChecklistConstant";
import {REPORT_TYPES, SAFE_REPORT_STATUS} from "@constants/ReportConstant";

import {APP_URLS, ORDER_BY, REPORT_NAMES} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {FacilityChecklistFilter} from "@repositories/Shared/ORM/FacilityChecklistFilter";
import {SafeEventLocationFilter} from "@repositories/Shared/ORM/SafeEventLocationFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    contactService,
    emailUtils,
    facilityChecklistService,
    processService,
    safeAssignmentCommentService,
    safeEventLocationService,
    safeFacilityChecklistService,
    safeReportEventLocationService,
    safeReportNotificationService,
    safeReportService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddReportDto, TSafeReport} from "./Dtos/AddReportDto";
import type {GetReportDto} from "./Dtos/GetReportDto";
import type {GetSafeReportDto} from "./Dtos/GetSafeReportDto";
import type {RemoveReportDto} from "./Dtos/RemoveReportDto";
import type {UpdateReportDto} from "./Dtos/UpdateReportDto";
import type {UpdateSafeReportDto} from "@application/SafeReport/Dtos/UpdateSafeReportDto";
import type {TSafeReportEventLocation} from "@application/SafeReportEventLocation/Dtos/UpdateSafeReportEventLocationDto";
import type {IAdminRepository} from "@entities/Admin/IAdminRepository";
import type {IFacilityRepository} from "@entities/Facility/IFacilityRepository";
import type {ProcessEntity} from "@entities/Process/ProcessEntity";
import type {IReportRepository} from "@entities/Report/IReportRepository";
import type {ISafeReportEntity} from "@entities/SafeReport/SafeReportEntity";
import type {Admin} from "@infrastructure/Database/Models/Admin";
import type {Report} from "@infrastructure/Database/Models/Report";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterReport} from "@repositories/Shared/Query/ReportQueryBuilder";

@injectable()
export class ReportService extends BaseService<Report, ReportEntity> {
    constructor(
        @inject("IReportRepository") private reportRepository: IReportRepository,
        @inject("IFacilityRepository") private facilityRepository: IFacilityRepository,
        @inject("IAdminRepository") private adminRepository: IAdminRepository
    ) {
        super(reportRepository);
    }

    async fetchPaginatedWithAdmins(searchFilters: TFilterReport, pagination: PaginationOptions) {
        return this.reportRepository.fetchPaginatedWithAdmins(searchFilters, pagination);
    }

    async fetchWithAssignees(searchFilters: TFilterReport) {
        return this.reportRepository.fetchWithAssignees(searchFilters);
    }

    async fetchWithAdmins(searchFilters: TFilterReport) {
        return this.reportRepository.fetchWithAdmins(searchFilters);
    }

    private async subRemoveReport(removeReportDto: RemoveReportDto) {
        const {reportId} = removeReportDto;
        const report = await this.fetch({reportId});

        if (!report) {
            return false;
        }

        if (!report.safeReportId) {
            return await this.remove({reportId});
        }

        await safeAssignmentCommentService.remove({safeReportId: report.safeReportId});

        await safeFacilityChecklistService.remove({
            safeReportId: report.safeReportId
        });

        await safeReportEventLocationService.remove({
            safeReportId: report.safeReportId
        });

        await safeReportService.remove({safeReportId: report.safeReportId});

        return await this.remove({reportId});
    }

    async removeReport(removeReportDto: RemoveReportDto) {
        try {
            const isReportRemoved = await this.subRemoveReport(removeReportDto);
            if (!isReportRemoved) {
                HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    private async setSafeFacilityChecklist(addReportDto: AddReportDto, safeReportEntity: ISafeReportEntity) {
        const facilityChecklistSearchFilters = FacilityChecklistFilter.setFilter({
            event: (addReportDto.safeReport as TSafeReport).safeFacilityChecklist as string[],
            facilityId: addReportDto.facilityId as string
        });
        const facilityChecklists = await facilityChecklistService.fetchAll(facilityChecklistSearchFilters, {
            id: ORDER_BY.ASC
        });
        if (!facilityChecklists) {
            return false;
        }

        await async.eachSeries(facilityChecklists, async (fc) => {
            try {
                await safeFacilityChecklistService.subAddSafeFacilityChecklist({
                    safeReportId: safeReportEntity.safeReportId,
                    facilityChecklistId: fc.facilityChecklistId
                });
            } catch (error) {
                ErrorLog(error);
            }
        });

        return facilityChecklists;
    }

    private async setSafeReportEventLocation(addReportDto: AddReportDto, safeReportEntity: ISafeReportEntity) {
        const safeEventLocationSearchFilters = SafeEventLocationFilter.setFilter({
            location: (addReportDto.safeReport as TSafeReport).safeReportEventLocation?.map(
                (srel) => srel.location
            ) as string[]
        });
        const safeEventLocations = await safeEventLocationService.fetchAll(safeEventLocationSearchFilters, {
            id: ORDER_BY.ASC
        });
        if (!safeEventLocations) {
            return false;
        }

        await async.eachSeries(safeEventLocations, async (fc) => {
            try {
                await safeReportEventLocationService.subAddSafeReportEventLocation({
                    safeReportId: safeReportEntity.safeReportId,
                    safeEventLocationId: fc.safeEventLocationId,
                    description: (addReportDto.safeReport as TSafeReport).safeReportEventLocation?.find(
                        (srel) => srel.location === fc.location
                    )?.description as string
                });
            } catch (error) {
                ErrorLog(error);
            }
        });

        return true;
    }

    async addReport(addReportDto: AddReportDto) {
        try {
            const reportEntity = ReportEntity.create(addReportDto);
            reportEntity.reportId = SharedUtils.shortUuid();

            reportEntity.status = SAFE_REPORT_STATUS.UNDER_INVESTIGATION;
            await this.create(reportEntity);

            const safeReportEntity = await safeReportService.subAddSafeReport(
                addReportDto.safeReport as unknown as ISafeReportEntity
            );

            const isSafeReportEventLocationAdded = await this.setSafeReportEventLocation(
                addReportDto,
                safeReportEntity
            );
            if (!isSafeReportEventLocationAdded) {
                return HttpResponse.notFound();
            }

            await this.update({reportId: reportEntity.reportId}, {
                ...reportEntity,
                safeReportId: safeReportEntity.safeReportId
            } as never);

            reportEntity.safeReportId = safeReportEntity.safeReportId;

            if (addReportDto.type === REPORT_TYPES.SAFE) {
                const isFacilityChecklistAdded = await this.setSafeFacilityChecklist(addReportDto, safeReportEntity);
                if (!isFacilityChecklistAdded) {
                    return HttpResponse.notFound();
                }

                const [topFacilityCheclist] = isFacilityChecklistAdded.sort((a, b) => a.priority - b.priority);

                await safeReportService.update({safeReportId: safeReportEntity.safeReportId}, {
                    eventType: topFacilityCheclist?.event
                } as never);

                safeReportEntity.eventType = topFacilityCheclist?.event as string;

                const assignees = await safeFacilityChecklistService.fetchAllSafeReportCheckList({
                    safeReportId: safeReportEntity.safeReportId
                });

                await safeReportNotificationService.sendNotification({
                    assignees: assignees as never,
                    facilityId: addReportDto.facilityId,
                    notificationType: reportEntity.status,
                    reportId: reportEntity.reportId,
                    reportCurrentStatus: SAFE_REPORT_STATUS.PENDING,
                    adminId: addReportDto.adminId,
                    reportType: REPORT_TYPES.SAFE,
                    safeReport: safeReportEntity,
                    isAwareness: true
                });

                await this.sendReportOnAdd(reportEntity);

                return HttpResponse.created(reportEntity);
            }

            const isFacilityChecklistAdded = await this.setSafeFacilityChecklist(addReportDto, safeReportEntity);
            if (!isFacilityChecklistAdded) {
                return HttpResponse.notFound();
            }
            const [facilityChecklist] = isFacilityChecklistAdded;
            await safeReportService.update({safeReportId: safeReportEntity.safeReportId}, {
                eventType: facilityChecklist?.event
            } as never);

            safeReportEntity.eventType = facilityChecklist?.event as string;

            const assignees = await safeFacilityChecklistService.fetchAllSafeReportCheckList({
                safeReportId: safeReportEntity.safeReportId
            });

            await safeReportNotificationService.sendNotification({
                assignees: assignees as never,
                facilityId: addReportDto.facilityId,
                notificationType: reportEntity.status,
                reportId: reportEntity.reportId,
                reportCurrentStatus: SAFE_REPORT_STATUS.PENDING,
                adminId: addReportDto.adminId,
                reportType: REPORT_TYPES.ISSUE,
                safeReport: safeReportEntity,
                isAwareness: true
            });

            await this.sendReportOnAdd(reportEntity);

            return HttpResponse.created(reportEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getReports(getReportDto: GetReportDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);

            const reports = await this.fetchPaginatedWithAdmins(getReportDto, pagination);
            if (!reports) {
                return HttpResponse.notFound();
            }

            const reportWithAssignees = await this.fetchWithAssignees({reportId: reports.rows.map((r) => r.reportId)});
            const reportEntities = reports.rows.map((r) => {
                const currentReport = reportWithAssignees
                    ? reportWithAssignees.find((ra) => ra.reportId === r.reportId)
                    : null;

                return {
                    ...ReportEntity.publicFields(r),
                    admin: r.isAnonymous
                        ? {}
                        : r.admin.deletedAt
                          ? {...AdminEntity.publicFields(r.admin), isDeleted: true}
                          : AdminEntity.publicFields(r.admin),
                    owner: currentReport
                        ? currentReport.safeReport
                            ? currentReport.safeReport.safeFacilityChecklist.length > 0
                                ? AdminEntity.publicFields(
                                      currentReport.safeReport.safeFacilityChecklist.find(
                                          (sfc) => sfc.facilityChecklist?.event === r.safeReport.eventType
                                      )?.facilityChecklist?.admin
                                  )
                                : {}
                            : {}
                        : {},
                    assignees: currentReport
                        ? currentReport.safeReport
                            ? currentReport.safeReport.safeFacilityChecklist.length > 0
                                ? currentReport.safeReport.safeFacilityChecklist.map((sfc) =>
                                      AdminEntity.publicFields(sfc.facilityChecklist.admin)
                                  )
                                : {}
                            : {}
                        : {}
                };
            });

            const paginationEntities = PaginationData.getPaginatedData(pagination, reports.count, reportEntities);

            return HttpResponse.ok(paginationEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getSafeReport(getSafeReportDto: GetSafeReportDto) {
        try {
            const report = await this.fetchWithAdmins(getSafeReportDto);
            if (!report) {
                return HttpResponse.notFound();
            }

            const reportEntity = {
                ...ReportEntity.publicFields(report),
                facility: FacilityEntity.create(report.facility),
                safeReport: report.safeReport ? SafeReportEntity.create(report.safeReport) : null,
                admin: report.isAnonymous
                    ? {}
                    : report.admin.deletedAt
                      ? {...AdminEntity.publicFields(report.admin), isDeleted: true}
                      : AdminEntity.publicFields(report.admin),
                owner: report?.safeReport?.safeFacilityChecklist.length
                    ? AdminEntity.publicFields(
                          report.safeReport?.safeFacilityChecklist.find(
                              (sfc) => sfc.facilityChecklist.event === report.safeReport.eventType
                          )?.facilityChecklist.admin
                      )
                    : {},
                assignees: report.safeReport?.safeFacilityChecklist.length
                    ? report.safeReport.safeFacilityChecklist.map((sfc) =>
                          AdminEntity.publicFields(sfc.facilityChecklist.admin)
                      )
                    : [],
                comment:
                    report.safeReport?.safeAssignmentComment.length > 0
                        ? report.safeReport?.safeAssignmentComment.map((sac) => ({
                              ...SafeAssignmentCommentEntity.publicFields(sac),
                              admin: AdminEntity.publicFields(sac.admin)
                          }))
                        : [],
                safeReportEventLocation: report.safeReport?.safeReportEventLocation.map((srel) => ({
                    ...SafeReportEventLocationEntity.create(srel),
                    ...SafeEventLocationEntity.create(srel.safeEventLocation)
                })),
                safeFacilityChecklist: report.safeReport?.safeFacilityChecklist.map(
                    (sfc) => sfc.facilityChecklist.event
                ),
                closedByAdmin: report.closedByAdmin ? AdminEntity.publicFields(report.closedByAdmin) : {}
            };

            return HttpResponse.ok(reportEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateReport(updateReportDto: UpdateReportDto) {
        try {
            const isReport = await this.fetch({reportId: updateReportDto.reportId as string});
            if (!isReport) {
                return HttpResponse.notFound();
            }

            const {adminId, ...newUpdateReportDto} = updateReportDto;
            const reportEntity = ReportEntity.create({...isReport, ...newUpdateReportDto});
            let safeAssignmentCommentId;

            reportEntity.closedByAdminId =
                updateReportDto.status === SAFE_REPORT_STATUS.CLOSED ? (adminId as string) : (null as never);

            await this.update({reportId: updateReportDto.reportId as string}, reportEntity);

            updateReportDto.safeReport &&
                (await safeReportService.subUpdateSafeReport({
                    ...updateReportDto.safeReport,
                    safeReportId: isReport.safeReportId
                } as UpdateSafeReportDto));

            const isFacilityChecklist = updateReportDto.safeFacilityChecklist
                ? await this.setUpdateSafeFacilityChecklist({
                      ...updateReportDto,
                      safeReport: {...updateReportDto.safeReport, safeReportId: isReport.safeReportId}
                  })
                : false;

            if (isFacilityChecklist && updateReportDto.safeReport && updateReportDto.isSenderEdit) {
                const [topFacilityCheclist] = isFacilityChecklist.sort((a, b) => a.priority - b.priority);

                await safeReportService.update({safeReportId: isReport.safeReportId}, {
                    eventType: topFacilityCheclist?.event
                } as never);
            }

            updateReportDto.safeReportEventLocation &&
                (await this.setUpdateSafeReportEventLocation({
                    ...updateReportDto,
                    safeReport: {...updateReportDto.safeReport, safeReportId: isReport.safeReportId}
                }));

            if (updateReportDto.safeAssignmentComment) {
                const safeAssignmentComment = await safeAssignmentCommentService.addSafeAssignmentComment({
                    safeReportId: isReport.safeReportId,
                    comment: updateReportDto.safeAssignmentComment,
                    adminId: adminId as string
                });
                safeAssignmentCommentId = safeAssignmentComment.safeAssignmentCommentId;
            }

            const safeFacilityChecklist = await safeFacilityChecklistService.fetchAllSafeReportCheckList({
                safeReportId: isReport.safeReportId
            });

            const safeReport = await safeReportService.fetch({safeReportId: isReport.safeReportId});

            await safeReportNotificationService.sendNotification({
                assignees: safeFacilityChecklist as never,
                notificationType: updateReportDto.status as never,
                facilityId: isReport.facilityId,
                reportId: isReport.reportId,
                safeAssignmentCommentId: safeAssignmentCommentId,
                reportCurrentStatus: isReport.status,
                eventType: updateReportDto.safeReport?.eventType as string,
                safeReport: safeReport as unknown as SafeReportEntity,
                reportType: updateReportDto.type ?? isReport.type,
                adminId: adminId as string
            });

            return HttpResponse.ok(reportEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async setUpdateSafeFacilityChecklist(updateReportDto: UpdateReportDto) {
        const facilityChecklistSearchFilters = FacilityChecklistFilter.setFilter({
            event: updateReportDto.safeFacilityChecklist as string[],
            facilityId: updateReportDto.facilityId as string
        });
        const facilityChecklists = await facilityChecklistService.fetchAll(facilityChecklistSearchFilters, {
            id: ORDER_BY.ASC
        });

        await safeFacilityChecklistService.subUpdateSafeFacilityChecklist({
            facilityChecklistId: facilityChecklists ? facilityChecklists.map((fc) => fc.facilityChecklistId) : [],
            safeReportId: updateReportDto.safeReport?.safeReportId as string
        });

        return facilityChecklists;
    }

    async setUpdateSafeReportEventLocation(updateReportDto: UpdateReportDto) {
        const safeEventLocationSearchFilters = SafeEventLocationFilter.setFilter({
            location: updateReportDto.safeReportEventLocation?.map((srel) => srel.location) as string[]
        });
        const safeEventLocations = await safeEventLocationService.fetchAll(safeEventLocationSearchFilters, {
            id: ORDER_BY.ASC
        });
        if (!safeEventLocations) {
            return false;
        }

        return await safeReportEventLocationService.subUpdateSafeReportEventLocation(
            {
                safeEventLocationId: safeEventLocations.map((sel) => sel.safeEventLocationId),
                safeReportId: updateReportDto.safeReport?.safeReportId as string,
                safeReportEventLocation: updateReportDto.safeReportEventLocation as TSafeReportEventLocation[]
            },
            safeEventLocations
        );
    }

    async sendReportOnAdd(reportEntity: ReportEntity) {
        const facility = await this.facilityRepository.fetch({facilityId: reportEntity.facilityId});
        if (!facility) {
            return false;
        }
        const facilityEntity = FacilityEntity.create(facility);

        const processes = await processService.subGetProcesses({
            processLabel: reportEntity.type
        });

        if (!processes) {
            return false;
        }

        let contacts = await contactService.subGetContactsFacilitiesProcess({
            facilityId: facilityEntity.facilityId,
            processLabel: reportEntity.type,
            type: (processes[0] as ProcessEntity).type === "BOTH" ? "" : (processes[0] as ProcessEntity).type
        });

        if (reportEntity.type === REPORT_NAMES.ISSUE_AWARENESS) {
            const facilityChecklistEmails = await facilityChecklistService.fetchByQuery({
                facilityId: facilityEntity.facilityId
            });
            if (facilityChecklistEmails) {
                const [emailToSkip] = facilityChecklistEmails
                    .filter((fc) => fc.event === FACILITY_CHECKLIST_EVENTS.ISSUE_REPORT)
                    .map((fc) => fc.admin.email);

                contacts = contacts ? contacts : [];

                const toEmails = contacts.map((contact) => contact.email).filter((email) => email !== emailToSkip);

                return await emailUtils.issueReportAwarenessEmailNotification({
                    facility: facilityEntity,
                    appUrl: APP_URLS.APP_URL,
                    toEmail: [...new Set(toEmails)]
                });
            }

            return false;
        }

        if (!contacts) {
            return false;
        }

        const assignees = await safeFacilityChecklistService.fetchAllSafeReportCheckList({
            safeReportId: reportEntity.safeReportId
        });

        if (!assignees) {
            return false;
        }

        const adminsToSkip = await this.adminRepository.fetchAllAdminsOnlyByQuery({
            adminId: assignees.map(({facilityChecklist}) => facilityChecklist.adminId)
        });

        const emailsToSkip: string[] = [];
        if (adminsToSkip) {
            emailsToSkip.push(...adminsToSkip.map((admin: Admin) => admin.email));
        }

        if (reportEntity.type === REPORT_NAMES.SAFE_AWARENESS) {
            const toContacts = contacts.filter((contact) => {
                return !emailsToSkip.includes(contact.email);
            });

            await async.eachSeries(toContacts, async (contact) => {
                await emailUtils.safeReportAwarenessEmailNotification({
                    firstName: contact.firstName as string,
                    facility: facilityEntity,
                    appUrl: APP_URLS.APP_URL,
                    toEmail: contact.email
                });
            });

            return true;
        }
    }
}
