import type {IUserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

type TGetUserSettingDTO = Pick<IUserSettingEntity, "userSettingId" | "adminId">;

export interface GetUserSettingDTO extends TGetUserSettingDTO {}

export class GetUserSettingDTO {
    constructor(body: TGetUserSettingDTO) {
        this.userSettingId = body.userSettingId;
        this.adminId = body.adminId;
    }

    static create(body: TGetUserSettingDTO): GetUserSettingDTO {
        return new GetUserSettingDTO(body);
    }
}
