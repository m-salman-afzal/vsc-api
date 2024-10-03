import type {INotificationEntity} from "@entities/Notification/NotificationEntity";

type IAddNotification = Pick<INotificationEntity, "repository" | "repositoryId" | "type" | "facilityId">;

export interface AddNotificationDto extends IAddNotification {}

export class AddNotificationDto {
    constructor(body: IAddNotification) {
        this.repository = body.repository;
        this.repositoryId = body.repositoryId;
        this.type = body.type;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new AddNotificationDto(body as IAddNotification);
    }
}
