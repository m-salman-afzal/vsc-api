import type {IUserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

type TUpdateUserSettingDTO = Pick<IUserSettingEntity, "userSettingId" | "adminId"> & {
    defaultFacilityId: string;
};

export interface UpdateUserSettingDTO extends TUpdateUserSettingDTO {}

export class UpdateUserSettingDTO {
    constructor(body: TUpdateUserSettingDTO) {
        this.userSettingId = body.userSettingId;
        this.adminId = body.adminId;
        this.defaultFacilityId = body.defaultFacilityId;
    }

    static create(body: TUpdateUserSettingDTO): UpdateUserSettingDTO {
        return new UpdateUserSettingDTO(body);
    }
}
