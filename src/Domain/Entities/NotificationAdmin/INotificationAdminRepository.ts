import type IBaseRepository from "@entities/IBaseRepository";
import type {NotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";
import type {NotificationAdmin} from "@infrastructure/Database/Models/NotificationAdmin";
import type {TFilterNotificationAdmin} from "@repositories/Shared/Query/NotificationAdminQueryBuilder";

export interface INotificationAdminRepository extends IBaseRepository<NotificationAdmin, NotificationAdminEntity> {
    getNotificationAdmins(searchFilters: TFilterNotificationAdmin): Promise<NotificationAdmin[] | false>;
}
