import async from "async";
import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {SafeAssignmentCommentEntity} from "@entities/SafeAssignmentComment/SafeAssignmentCommentEntity";
import {SafeReportNotificationEntity} from "@entities/SafeReportNotification/SafeReportNotificationEntity";

import {PERMISSIONS, SAFE_REPORT_AUTH_ROUTES} from "@constants/AuthConstant";
import {REPOSITORIES} from "@constants/FileConstant";
import {REPORT_TYPES, SAFE_REPORT_STATUS} from "@constants/ReportConstant";
import {SAFE_REPORT_NOTIFICATION_TYPES} from "@constants/SafeReportNotificationConstant";

import {APP_URLS, CONTACT_TYPES} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";

import {BaseService} from "@application/BaseService";
import {AddNotificationDto} from "@application/Notification/DTOs/AddNotificationDTO";
import {AddNotificationAdminDto} from "@application/NotificationAdmins/DTOs/AddNotificationAdminDTO";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    contactService,
    emailUtils,
    notificationAdminService,
    notificationService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddSafeReportNotificationDto} from "./DTOs/AddSafeReportNotificationDTO";
import type {GetSafeReportNotificationDto} from "./DTOs/GetSafeReportNotificationDTO";
import type {IAdminRoleRepository} from "@entities/AdminRole/IAdminRoleRepository";
import type {IFacilityRepository} from "@entities/Facility/IFacilityRepository";
import type {IReportRepository} from "@entities/Report/IReportRepository";
import type {IRoleServiceListRepository} from "@entities/RoleServiceList/IRoleServiceListRepository";
import type {ISafeReportNotificationRepository} from "@entities/SafeReportNotification/ISafeReportNotificationRepository";
import type {IServiceListRepository} from "@entities/ServiceList/IServiceListRepository";
import type {SafeReportNotification} from "@infrastructure/Database/Models/SafeReportNotification";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class SafeReportNotificationService extends BaseService<SafeReportNotification, SafeReportNotificationEntity> {
    constructor(
        @inject("ISafeReportNotificationRepository")
        private safeReportNotificationRepository: ISafeReportNotificationRepository,
        @inject("IReportRepository") private reportRepository: IReportRepository,
        @inject("IRoleServiceListRepository") private roleServiceListRepository: IRoleServiceListRepository,
        @inject("IServiceListRepository") private serviceListRepository: IServiceListRepository,
        @inject("IAdminRoleRepository") private adminRoleRepository: IAdminRoleRepository,
        @inject("IFacilityRepository") private facilityRepository: IFacilityRepository
    ) {
        super(safeReportNotificationRepository);
    }

    async getSafeReportNotification(
        getSafeReportNotificationDto: GetSafeReportNotificationDto,
        paginationDTO: PaginationDto
    ) {
        try {
            const searchFilter = getSafeReportNotificationDto;
            const pagination = PaginationOptions.create(paginationDTO);
            const safeReportNotification = await this.safeReportNotificationRepository.fetchPaginatedWithComment(
                searchFilter,
                pagination
            );
            if (!safeReportNotification) {
                return HttpResponse.notFound();
            }
            const safeReportNotificationEntities: any = [];
            safeReportNotification.rows.forEach((notification) => {
                const safeReportNotificationEntity = SafeReportNotificationEntity.publicFields(notification);
                let comment: any = {};
                if (safeReportNotificationEntity.safeAssignmentCommentId) {
                    comment = SafeAssignmentCommentEntity.create(notification.safeAssignmentComment);
                    comment.admin = AdminEntity.publicFields(notification.safeAssignmentComment.admin);
                }
                safeReportNotificationEntities.push({...safeReportNotificationEntity, comment});
            });

            const notifications = PaginationData.getPaginatedData(
                pagination,
                safeReportNotification.count,
                safeReportNotificationEntities
            );

            return HttpResponse.ok(notifications);
        } catch (error: unknown) {
            return HttpResponse.error({message: ErrorLog(error as Error)});
        }
    }

    getNotificationStatus(notificationType, currentStatus, eventType?: string, reportType?: string) {
        let type = SAFE_REPORT_NOTIFICATION_TYPES.ASSIGN;
        if (currentStatus === SAFE_REPORT_STATUS.UNDER_INVESTIGATION && eventType) {
            type = SAFE_REPORT_NOTIFICATION_TYPES.OWNERSHIP_TRANSFER;
        }
        if (
            notificationType === SAFE_REPORT_STATUS.UNDER_INVESTIGATION &&
            currentStatus === SAFE_REPORT_STATUS.PENDING
        ) {
            type = SAFE_REPORT_NOTIFICATION_TYPES.ASSIGN;
        }

        if (
            notificationType === SAFE_REPORT_STATUS.PENDING &&
            currentStatus === SAFE_REPORT_STATUS.UNDER_INVESTIGATION
        ) {
            type = SAFE_REPORT_NOTIFICATION_TYPES.RETURNED_SENDER;
        }
        if (
            (notificationType === SAFE_REPORT_STATUS.IN_REVIEW &&
                currentStatus === SAFE_REPORT_STATUS.UNDER_INVESTIGATION) ||
            (notificationType === SAFE_REPORT_STATUS.IN_REVIEW && currentStatus === SAFE_REPORT_STATUS.CLOSED)
        ) {
            type = SAFE_REPORT_NOTIFICATION_TYPES.IN_REVIEW;
        }

        if (
            notificationType === SAFE_REPORT_STATUS.UNDER_INVESTIGATION &&
            currentStatus === SAFE_REPORT_STATUS.IN_REVIEW
        ) {
            type = SAFE_REPORT_NOTIFICATION_TYPES.RETURNED_OWNER;
        }
        if (notificationType === SAFE_REPORT_STATUS.CLOSED) {
            type = SAFE_REPORT_NOTIFICATION_TYPES.CLOSED;
        }
        if (
            currentStatus === SAFE_REPORT_STATUS.UNDER_INVESTIGATION &&
            !notificationType &&
            ((reportType === REPORT_TYPES.SAFE && !eventType) || reportType === REPORT_TYPES.ISSUE)
        ) {
            type = null as unknown as string;
        }

        return type;
    }

    async subAddSafeReportNotification(addNotificationDto: AddSafeReportNotificationDto, type: string) {
        const notificationEntity = await notificationService.subAddNotification(
            AddNotificationDto.create({
                repository: addNotificationDto.safeAssignmentCommentId
                    ? REPOSITORIES.SAFE_ASSIGNMENT_COMMENT
                    : REPOSITORIES.SAFE_REPORT,
                repositoryId: addNotificationDto.safeAssignmentCommentId
                    ? addNotificationDto.safeAssignmentCommentId
                    : addNotificationDto.safeReport.safeReportId,
                type: type,
                facilityId: addNotificationDto.facilityId as string
            })
        );
        const isNotification = await notificationService.subGetNotification({
            notificationId: notificationEntity.notificationId
        });
        if (!isNotification) {
            return;
        }

        return isNotification;
    }

    async sendEmailNotification(
        adminId: string | string[],
        facilityId: string,
        isOwner?: boolean,
        type?: string,
        reportType?: string
    ) {
        adminId = Array.isArray(adminId) ? adminId : [adminId];
        const admins = await this.adminRoleRepository.fetchWithAdmins({adminId});
        const facility = await this.facilityRepository.fetch({facilityId: facilityId});
        if (admins && facility) {
            const facilityEntity = FacilityEntity.create(facility);
            const toEmailSet = new Set(admins.filter((item) => item.admin).map((item) => item.admin.email));
            const uniqueToEmail = Array.from(toEmailSet);

            await emailUtils.safeReportEmailNotification({
                facility: facilityEntity,
                toEmail: uniqueToEmail,
                appUrl: APP_URLS.APP_URL,
                admin: admins[0]?.admin as unknown as AdminEntity,
                isOwner,
                type,
                reportType
            });
        }
    }

    async sendNotification(addNotificationDto: AddSafeReportNotificationDto) {
        try {
            const {assignees, notificationType, reportCurrentStatus, eventType, reportType} = addNotificationDto;
            const type = this.getNotificationStatus(notificationType, reportCurrentStatus, eventType, reportType);

            if (assignees && type === SAFE_REPORT_NOTIFICATION_TYPES.ASSIGN) {
                await this.sendAssigneeNotifications(addNotificationDto, assignees);
            }

            if (
                type === SAFE_REPORT_NOTIFICATION_TYPES.RETURNED_SENDER ||
                type === SAFE_REPORT_NOTIFICATION_TYPES.CLOSED ||
                type === SAFE_REPORT_NOTIFICATION_TYPES.SUBMITTED ||
                ((reportType === REPORT_TYPES.SAFE || reportType === REPORT_TYPES.ISSUE || !reportType) &&
                    reportCurrentStatus === SAFE_REPORT_STATUS.PENDING &&
                    notificationType === SAFE_REPORT_STATUS.UNDER_INVESTIGATION)
            ) {
                await this.sendSenderNotification(addNotificationDto, type, reportType);
            }

            if (type === SAFE_REPORT_NOTIFICATION_TYPES.IN_REVIEW) {
                await this.sendReviewNotifications(addNotificationDto);
            }

            if (type === SAFE_REPORT_NOTIFICATION_TYPES.RETURNED_OWNER) {
                await this.sendOwnerNotification(addNotificationDto);
            }

            if (type === SAFE_REPORT_NOTIFICATION_TYPES.OWNERSHIP_TRANSFER) {
                await this.sendChangeOfOwnerShip(addNotificationDto);
            }

            return true;
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error as Error)});
        }
    }

    async sendReportOnClosed(addNotificationDto: AddSafeReportNotificationDto) {
        const {reportId} = addNotificationDto;
        const sender = await this.reportRepository.fetchWithAdmins({reportId});
        if (sender) {
            const notificationEntity = await this.subAddSafeReportNotification(
                addNotificationDto,
                SAFE_REPORT_NOTIFICATION_TYPES.CLOSED
            );

            await notificationAdminService.subAddNotificationAdmin(
                notificationEntity,
                AddNotificationAdminDto.create({
                    notificationId: notificationEntity.notificationId,
                    adminId: sender.adminId
                })
            );
        }
    }

    async sendReportOnSubmit(addNotificationDto: AddSafeReportNotificationDto) {
        const {reportId} = addNotificationDto;
        const sender = await this.reportRepository.fetchWithAdmins({reportId});
        if (sender) {
            const notificationEntity = await this.subAddSafeReportNotification(
                addNotificationDto,
                SAFE_REPORT_NOTIFICATION_TYPES.SUBMITTED
            );

            await notificationAdminService.subAddNotificationAdmin(
                notificationEntity,
                AddNotificationAdminDto.create({
                    notificationId: notificationEntity.notificationId,
                    adminId: sender.adminId
                })
            );
        }
    }

    async sendChangeOfOwnerShip(addNotificationDto: AddSafeReportNotificationDto) {
        const {assignees, eventType} = addNotificationDto;
        if (assignees) {
            const newOwner = assignees.find((item) => item.facilityChecklist.event === eventType);
            if (newOwner) {
                const notificationEntity = await this.subAddSafeReportNotification(
                    addNotificationDto,
                    SAFE_REPORT_NOTIFICATION_TYPES.OWNERSHIP_TRANSFER
                );

                await notificationAdminService.subAddNotificationAdmin(
                    notificationEntity,
                    AddNotificationAdminDto.create({
                        notificationId: notificationEntity.notificationId,
                        adminId: newOwner?.facilityChecklist.adminId
                    })
                );

                await this.sendEmailNotification(
                    newOwner.facilityChecklist.adminId,
                    addNotificationDto.facilityId as string,
                    true
                );
            }
        }
    }

    async sendAssigneeNotifications(addNotificationDto: AddSafeReportNotificationDto, assignees: any[]) {
        const {safeReport, reportType} = addNotificationDto;
        const adminIds: string[] = [];
        const contacts = await contactService.subGetContactsFacilitiesProcess({
            facilityId: addNotificationDto.facilityId as string,
            processLabel: reportType as string,
            type: CONTACT_TYPES.INTERNAL
        });

        const admins = Array.from(new Set(assignees.map((x) => x.facilityChecklist.adminId)));

        if (reportType === "ISSUE") {
            const notificationEntity = await this.subAddSafeReportNotification(
                addNotificationDto,
                SAFE_REPORT_NOTIFICATION_TYPES.ASSIGN
            );

            await async.eachSeries(admins, async (adminId) => {
                if (adminId !== addNotificationDto.adminId) {
                    adminIds.push(adminId);

                    await notificationAdminService.subAddNotificationAdmin(
                        notificationEntity,
                        AddNotificationAdminDto.create({
                            notificationId: notificationEntity.notificationId,
                            adminId: adminId
                        })
                    );
                }
            });

            if (addNotificationDto.isAwareness && contacts && contacts.length) {
                const notificationEntity = await this.subAddSafeReportNotification(
                    addNotificationDto,
                    SAFE_REPORT_NOTIFICATION_TYPES.AWARENESS
                );

                await async.eachSeries(contacts, async (contact) => {
                    if (!adminIds.includes(contact.adminId) && contact.adminId !== addNotificationDto.adminId) {
                        await notificationAdminService.subAddNotificationAdmin(
                            notificationEntity,
                            AddNotificationAdminDto.create({
                                notificationId: notificationEntity.notificationId,
                                adminId: contact.adminId
                            })
                        );
                    }
                });
            }

            await this.sendEmailNotification(
                adminIds,
                addNotificationDto.facilityId as string,
                true,
                undefined,
                addNotificationDto.reportType
            );

            return;
        }

        const owner = safeReport
            ? assignees.find((ad) => ad.facilityChecklist.event === safeReport.eventType)
            : assignees[0];

        const notificationAssigneeEntity = await this.subAddSafeReportNotification(
            addNotificationDto,
            SAFE_REPORT_NOTIFICATION_TYPES.ASSIGN
        );

        await async.eachSeries(admins, async (adminId) => {
            if (adminId !== owner?.facilityChecklist.adminId && !adminIds.includes(adminId)) {
                adminIds.push(adminId);

                await notificationAdminService.subAddNotificationAdmin(
                    notificationAssigneeEntity,
                    AddNotificationAdminDto.create({
                        notificationId: notificationAssigneeEntity.notificationId,
                        adminId: adminId
                    })
                );
            }
        });

        if (addNotificationDto.isAwareness && contacts && contacts.length) {
            const notificationAwarenessEntity = await this.subAddSafeReportNotification(
                addNotificationDto,
                SAFE_REPORT_NOTIFICATION_TYPES.AWARENESS
            );

            await async.eachSeries(contacts, async (contact) => {
                if (!admins.includes(contact.adminId) && contact.adminId !== addNotificationDto.adminId) {
                    await notificationAdminService.subAddNotificationAdmin(
                        notificationAwarenessEntity,
                        AddNotificationAdminDto.create({
                            notificationId: notificationAwarenessEntity.notificationId,
                            adminId: contact.adminId
                        })
                    );
                }
            });
        }

        const notificationEntity = await this.subAddSafeReportNotification(
            addNotificationDto,
            SAFE_REPORT_NOTIFICATION_TYPES.OWNERSHIP_TRANSFER
        );

        await notificationAdminService.subAddNotificationAdmin(
            notificationEntity,
            AddNotificationAdminDto.create({
                notificationId: notificationEntity.notificationId,
                adminId: owner?.facilityChecklist.adminId
            })
        );

        if (adminIds.length) {
            await this.sendEmailNotification(adminIds, addNotificationDto.facilityId as string);
        }

        await this.sendEmailNotification(
            owner?.facilityChecklist.adminId,
            addNotificationDto.facilityId as string,
            true,
            addNotificationDto.reportType
        );
    }

    async sendSenderNotification(
        addNotificationDto: AddSafeReportNotificationDto,
        notificationType: string,
        reportType?: string
    ) {
        notificationType =
            notificationType === SAFE_REPORT_NOTIFICATION_TYPES.ASSIGN
                ? SAFE_REPORT_NOTIFICATION_TYPES.SUBMITTED
                : notificationType;
        const {reportId} = addNotificationDto;
        const sender = await this.reportRepository.fetchWithAdmins({reportId});
        if (sender) {
            const notificationEntity = await this.subAddSafeReportNotification(addNotificationDto, notificationType);

            await notificationAdminService.subAddNotificationAdmin(
                notificationEntity,
                AddNotificationAdminDto.create({
                    notificationId: notificationEntity.notificationId,
                    adminId: sender.adminId
                })
            );

            if (notificationType === SAFE_REPORT_NOTIFICATION_TYPES.RETURNED_SENDER) {
                await this.sendEmailNotification(
                    sender.adminId,
                    addNotificationDto.facilityId as string,
                    undefined,
                    notificationType,
                    reportType
                );
            }
        }
    }

    async sendReviewNotifications(addNotificationDto: AddSafeReportNotificationDto) {
        const {facilityId} = addNotificationDto;
        const safeReportReviewsAccess = await this.serviceListRepository.fetch({
            name: SAFE_REPORT_AUTH_ROUTES.SAFE_REPORT_REVIEWS
        });
        if (!safeReportReviewsAccess) {
            return;
        }

        const roleService = await this.roleServiceListRepository.fetchAllByPermission({
            serviceListId: safeReportReviewsAccess.serviceListId,
            permissions: [PERMISSIONS.WRITE, PERMISSIONS.READ]
        });
        if (!roleService) {
            return;
        }

        const roleIds = roleService.map((role) => role.roleId);
        const adminsRoles = await this.adminRoleRepository.fetchWithAdmins({roleId: roleIds, facilityId: facilityId});
        if (!adminsRoles) {
            return;
        }

        const adminIds = new Set(adminsRoles.filter((item) => item.admin).map((item) => item.admin.adminId));
        const uniqueToAdmins = Array.from(adminIds);

        const notificationEntity = await this.subAddSafeReportNotification(
            addNotificationDto,
            SAFE_REPORT_NOTIFICATION_TYPES.IN_REVIEW
        );

        await async.eachSeries(uniqueToAdmins, async (adminId) => {
            if (adminId) {
                await notificationAdminService.subAddNotificationAdmin(
                    notificationEntity,
                    AddNotificationAdminDto.create({
                        notificationId: notificationEntity.notificationId,
                        adminId: adminId
                    })
                );
            }
        });

        await this.sendEmailNotification(
            uniqueToAdmins,
            addNotificationDto.facilityId as string,
            undefined,
            SAFE_REPORT_NOTIFICATION_TYPES.IN_REVIEW
        );
    }

    async sendOwnerNotification(addNotificationDto: AddSafeReportNotificationDto) {
        const {assignees, reportId} = addNotificationDto;
        const adminIds: string[] = [];

        const lastOwner = await notificationService.subGetNotificationWithAdmins({
            repositoryId: reportId as string,
            notificationType: SAFE_REPORT_NOTIFICATION_TYPES.OWNERSHIP_TRANSFER
        });

        const notificationEntity = await this.subAddSafeReportNotification(
            addNotificationDto,
            SAFE_REPORT_NOTIFICATION_TYPES.RETURNED_OWNER
        );

        await async.eachSeries(assignees, async ({facilityChecklist}: any) => {
            if (!adminIds.includes(facilityChecklist.adminId)) {
                await notificationAdminService.subAddNotificationAdmin(
                    notificationEntity,
                    AddNotificationAdminDto.create({
                        notificationId: notificationEntity.notificationId,
                        adminId: facilityChecklist.adminId
                    })
                );
            }

            if (lastOwner[0].adminId !== facilityChecklist.adminId) {
                adminIds.push(facilityChecklist.adminId);
            }
        });

        await this.sendEmailNotification(lastOwner[0].adminId, addNotificationDto.facilityId as string, true);
        await this.sendEmailNotification(adminIds, addNotificationDto.facilityId as string);
    }
}
