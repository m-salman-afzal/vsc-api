import type {IUserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

type TAddUserSettingDTO = Pick<IUserSettingEntity, "setting" | "adminId">;

export interface AddUserSettingDTO extends TAddUserSettingDTO {}

export class AddUserSettingDTO {
    constructor(body: TAddUserSettingDTO) {
        this.setting = body.setting;
        this.adminId = body.adminId;
    }

    static create(body: TAddUserSettingDTO): AddUserSettingDTO {
        return new AddUserSettingDTO(body);
    }
}
