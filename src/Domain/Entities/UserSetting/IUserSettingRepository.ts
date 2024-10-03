import type IBaseRepository from "@entities/IBaseRepository";
import type {UserSettingEntity} from "@entities/UserSetting/UserSettingEntity";
import type {UserSetting} from "@infrastructure/Database/Models/UserSetting";

export interface IUserSettingRepository extends IBaseRepository<UserSetting, UserSettingEntity> {}
