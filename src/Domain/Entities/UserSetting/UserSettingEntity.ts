import type {TUserSetting} from "@typings/UserSetting";

export interface IUserSettingEntity {
    userSettingId: string;
    setting: TUserSetting;
    adminId: string;
}

export interface UserSettingEntity extends IUserSettingEntity {}

export class UserSettingEntity {
    constructor(userSettingEntity: IUserSettingEntity) {
        this.userSettingId = userSettingEntity.userSettingId;
        this.setting = userSettingEntity.setting;
        this.adminId = userSettingEntity.adminId;
    }

    static create(userSettingEntity) {
        return new UserSettingEntity(userSettingEntity);
    }
}
