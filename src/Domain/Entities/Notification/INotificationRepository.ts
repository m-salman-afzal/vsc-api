import type IBaseRepository from "@entities/IBaseRepository";
import type {NotificationEntity} from "@entities/Notification/NotificationEntity";
import type {Notification} from "@infrastructure/Database/Models/Notification";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterNotification} from "@repositories/Shared/Query/NotificationQueryBuilder";

export type TOrder = "ASC" | "DESC";

export interface INotificationRepository extends IBaseRepository<Notification, NotificationEntity> {
    getFacilities(searchFilters: TFilterNotification): Promise<any[] | false>;

    fetchNotificationWithAdmin(searchFilters: TFilterNotification): Promise<Notification | false>;

    fetchNotificationWithAdminAndRepository(searchFilters: TFilterNotification): Promise<Notification | false>;

    fetchPaginatedNotificationsWithAdminAndRepository(
        searchFilters: TFilterNotification,
        pagination: PaginationOptions,
        order?: TOrder
    ): Promise<
        | {
              count: number;
              rows: Notification[];
          }
        | false
    >;

    fetchNotificationsWithAdminAndRepositoryCount(searchFilters: TFilterNotification): Promise<{
        count: number;
    }>;
}
