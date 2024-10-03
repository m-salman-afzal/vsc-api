import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {ControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import {NotificationEntity} from "@entities/Notification/NotificationEntity";
import {NotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";
import {ReportEntity} from "@entities/Report/ReportEntity";
import {SafeAssignmentCommentEntity} from "@entities/SafeAssignmentComment/SafeAssignmentCommentEntity";
import {SafeReportEntity} from "@entities/SafeReport/SafeReportEntity";

import {REPOSITORIES} from "@constants/FileConstant";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddNotificationDto} from "./DTOs/AddNotificationDTO";
import type {GetNotificationDto} from "./DTOs/GetNotificationDTO";
import type {INotificationRepository} from "@entities/Notification/INotificationRepository";
import type {Notification} from "@infrastructure/Database/Models/Notification";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class NotificationService extends BaseService<Notification, NotificationEntity> {
    constructor(
        @inject("INotificationRepository")
        private notificationRepository: INotificationRepository
    ) {
        super(notificationRepository);
    }

    async getNotificationsWithAdminAndRepositoryCount(getNotificationDto: GetNotificationDto) {
        const searchFilters = getNotificationDto;

        const count = await this.notificationRepository.fetchNotificationsWithAdminAndRepositoryCount({
            ...searchFilters,
            currentDate: SharedUtils.getCurrentDate({})
        });

        return count;
    }

    async getFacilities(getNotificationDto: GetNotificationDto) {
        const searchFilters = getNotificationDto;

        const isNotification = await this.notificationRepository.getFacilities({
            ...searchFilters,
            currentDate: SharedUtils.getCurrentDate({})
        });
        if (!isNotification) {
            return HttpResponse.notFound();
        }

        return HttpResponse.ok(isNotification);
    }

    async subGetNotificationWithAdmins(getNotificationDto: GetNotificationDto) {
        const searchFilter = getNotificationDto;

        const isNotification = await this.notificationRepository.fetchNotificationWithAdmin(searchFilter);
        if (!isNotification) {
            return false;
        }

        const notificationEntities = isNotification.notificationAdmin.map((notificationAdmin) => {
            const notification: any = {
                ...NotificationEntity.create(isNotification),
                ...NotificationAdminEntity.create(notificationAdmin)
            };

            return notification;
        });

        return notificationEntities;
    }

    subProcessNotification = (notification: any) => {
        const notificationEntity: any = {
            ...NotificationEntity.notificationFields(notification),
            ...NotificationAdminEntity.create(notification),
            ...FacilityEntity.create(notification)
        };

        switch (notification.repository) {
            case REPOSITORIES.FORMULARY:
                notificationEntity.formulary = FormularyEntity.create(notification);
                break;
            case REPOSITORIES.SAFE_REPORT:
                notificationEntity.report = ReportEntity.notificationFields(notification);
                notificationEntity.safeReport = SafeReportEntity.create(notification);
                break;
            case REPOSITORIES.SAFE_ASSIGNMENT_COMMENT:
                notificationEntity.report = ReportEntity.notificationFields(notification);
                notificationEntity.safeReport = SafeReportEntity.create(notification);
                notificationEntity.safeAssignmentComment = SafeAssignmentCommentEntity.create(notification);
                notificationEntity.safeAssignmentComment.admin = AdminEntity.publicFields(notification);
                break;
            case REPOSITORIES.CONTROLLED_DRUG:
                notificationEntity.formulary = FormularyEntity.create(notification);
                notificationEntity.controlledDrug = ControlledDrugEntity.create(notification);
                break;
            case REPOSITORIES.SHIFT_COUNT_LOG:
                notificationEntity.cart = notification.cart;
                notificationEntity.shiftCountLogId = notification.shiftCountLogId;
                break;
            default:
                notificationEntity;
        }

        return notificationEntity;
    };

    async subGetNotification(getNotificationDto: GetNotificationDto) {
        const searchFilters = getNotificationDto;

        const isNotification = await this.notificationRepository.fetchNotificationWithAdminAndRepository({
            ...searchFilters,
            currentDate: SharedUtils.getCurrentDate({})
        });
        if (!isNotification) {
            return false;
        }

        return this.subProcessNotification(isNotification);
    }

    subGetFilters(getNotificationDto: GetNotificationDto) {
        if (getNotificationDto.isAlert) {
            return {...getNotificationDto, isRead: false, isArchived: false};
        }

        if (getNotificationDto.screen === "archived") {
            return {...getNotificationDto, isArchived: true};
        }

        return {...getNotificationDto, isArchived: false};
    }

    async getNotification(getNotificationDto: GetNotificationDto, paginationDTO: PaginationDto) {
        try {
            const searchFilters = this.subGetFilters(getNotificationDto);

            const pagination = PaginationOptions.create(paginationDTO);
            const isNotifications = await this.notificationRepository.fetchPaginatedNotificationsWithAdminAndRepository(
                {
                    ...searchFilters,
                    currentDate: SharedUtils.getCurrentDate({})
                },
                pagination,
                ORDER_BY.DESC
            );
            if (!isNotifications) {
                return HttpResponse.notFound();
            }

            const notificationEntities = isNotifications.rows.map((isNotification) => {
                return this.subProcessNotification(isNotification);
            });

            const notifications = PaginationData.getPaginatedData(
                pagination,
                isNotifications.count,
                notificationEntities
            );

            if (!notifications) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(notifications);
        } catch (error: unknown) {
            return HttpResponse.error({message: ErrorLog(error as Error)});
        }
    }

    async subAddNotification(addNotificationDto: AddNotificationDto) {
        const notificationEntity = NotificationEntity.create(addNotificationDto);
        notificationEntity.notificationId = SharedUtils.shortUuid();
        await this.create(notificationEntity);

        return notificationEntity;
    }
}
