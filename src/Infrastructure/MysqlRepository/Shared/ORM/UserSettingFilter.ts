import type {IUserSettingEntity} from "@entities/UserSetting/UserSettingEntity";
import type {UserSetting} from "@infrastructure/Database/Models/UserSetting";
import type {TWhereFilter} from "@typings/ORM";

type TFilterUserSetting = Partial<IUserSettingEntity>;

type TWhereUserSetting = TWhereFilter<UserSetting>;

export class UserSettingFilter {
    private where: TWhereUserSetting;
    constructor(filters: TFilterUserSetting) {
        this.where = {};
        this.setUserSettingId(filters);
        this.setAdminId(filters);
    }

    static setFilter(filters: TFilterUserSetting) {
        return new UserSettingFilter(filters).where;
    }

    setUserSettingId(filters: TFilterUserSetting) {
        if (filters.userSettingId) {
            this.where.userSettingId = filters.userSettingId;
        }
    }

    setAdminId(filters: TFilterUserSetting) {
        if (filters.adminId) {
            this.where.adminId = filters.adminId;
        }
    }
}
