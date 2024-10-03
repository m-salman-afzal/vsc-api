import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {NotificationAdmin} from "@infrastructure/Database/Models/NotificationAdmin";

import {NotificationAdminQueryBuilder} from "./Shared/Query/NotificationAdminQueryBuilder";

import type {TFilterNotificationAdmin} from "./Shared/Query/NotificationAdminQueryBuilder";
import type {INotificationAdminRepository} from "@entities/NotificationAdmin/INotificationAdminRepository";
import type {NotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";

@injectable()
export class NotificationAdminRepository
    extends BaseRepository<NotificationAdmin, NotificationAdminEntity>
    implements INotificationAdminRepository
{
    constructor() {
        super(NotificationAdmin);
    }

    async getNotificationAdmins(searchFilters: TFilterNotificationAdmin): Promise<NotificationAdmin[] | false> {
        const query = this.model
            .createQueryBuilder("notificationAdmin")
            .leftJoinAndSelect("notificationAdmin.notification", "notification");

        const queryFilters = NotificationAdminQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }
}
