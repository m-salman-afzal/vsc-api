import {inject, injectable} from "tsyringe";

import {NotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {notificationService, webSocketService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddNotificationAdminDto} from "./DTOs/AddNotificationAdminDTO";
import type {GetNotificationAdminDto} from "./DTOs/GetNotificationAdminDTO";
import type {MarkAsArchiveNotificationAdminDto} from "./DTOs/MarkAsArchiveNotificationDto";
import type {MarkAsReadNotificationAdminDTO} from "./DTOs/MarkAsReadNotificationAdminDTO";
import type {INotificationAdminRepository} from "@entities/NotificationAdmin/INotificationAdminRepository";
import type {NotificationAdmin} from "@infrastructure/Database/Models/NotificationAdmin";

@injectable()
export class NotificationAdminService extends BaseService<NotificationAdmin, NotificationAdminEntity> {
    constructor(
        @inject("INotificationAdminRepository")
        private notificationAdminRepository: INotificationAdminRepository
    ) {
        super(notificationAdminRepository);
    }

    async subGetNotificationAdmins(getNotificationAdminDto: GetNotificationAdminDto) {
        const searchFilter = getNotificationAdminDto;

        const isNotificationAdmins = await this.notificationAdminRepository.getNotificationAdmins(searchFilter);
        if (!isNotificationAdmins) {
            return false;
        }

        const notificationAdminEntities = isNotificationAdmins.map((notificationAdmin) => {
            return NotificationAdminEntity.create(notificationAdmin);
        });

        return notificationAdminEntities;
    }

    async subAddNotificationAdmin(notificationEntity: any, addNotificationAdminDto: AddNotificationAdminDto) {
        const notificationAdminEntity = NotificationAdminEntity.create({
            ...addNotificationAdminDto,
            notificationId: notificationEntity.notificationId
        });
        notificationAdminEntity.notificationAdminId = SharedUtils.shortUuid();
        notificationAdminEntity.isArchived = addNotificationAdminDto.isArchived
            ? addNotificationAdminDto.isArchived
            : false;
        notificationAdminEntity.isRead = addNotificationAdminDto.isRead ? addNotificationAdminDto.isRead : false;
        await this.create(notificationAdminEntity);
        await webSocketService.sendNotificationStatsEvent({
            ...notificationEntity,
            ...notificationAdminEntity,
            adminId: notificationAdminEntity.adminId
        });
    }

    async markAsReadNotification(markAsReadDto: MarkAsReadNotificationAdminDTO) {
        try {
            const {notificationAdminId, isRead} = markAsReadDto;
            const isNotificationAdmin = await this.fetch({
                notificationAdminId: notificationAdminId as string
            });

            if (!isNotificationAdmin) {
                return HttpResponse.notFound();
            }

            const notificationAdminEntity = NotificationAdminEntity.create(isNotificationAdmin);
            notificationAdminEntity.isRead = isRead;

            await this.update({notificationAdminId}, notificationAdminEntity);

            const {count} = await notificationService.getNotificationsWithAdminAndRepositoryCount({
                adminId: notificationAdminEntity.adminId,
                isRead: false
            });

            await webSocketService.sendNotificationCountEvent(count, notificationAdminEntity.adminId);

            return HttpResponse.ok(notificationAdminEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error as Error)});
        }
    }

    async markAsArchiveNotification(markAsArchiveNotificationDto: MarkAsArchiveNotificationAdminDto) {
        try {
            const {notificationAdminId, isArchived} = markAsArchiveNotificationDto;
            const isNotificationAdmin = await this.fetch({
                notificationAdminId: notificationAdminId
            });

            if (!isNotificationAdmin) {
                return HttpResponse.notFound();
            }

            const notificationAdminEntity = NotificationAdminEntity.create(isNotificationAdmin);
            notificationAdminEntity.isArchived = isArchived;

            await this.update({notificationAdminId}, notificationAdminEntity);

            return HttpResponse.ok({notificationAdminEntity});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error as Error)});
        }
    }
}
