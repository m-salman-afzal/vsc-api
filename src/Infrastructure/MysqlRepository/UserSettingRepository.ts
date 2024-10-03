import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {UserSetting} from "@infrastructure/Database/Models/UserSetting";

import type {IUserSettingRepository} from "@entities/UserSetting/IUserSettingRepository";
import type {UserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

@injectable()
export class UserSettingRepository
    extends BaseRepository<UserSetting, UserSettingEntity>
    implements IUserSettingRepository
{
    constructor() {
        super(UserSetting);
    }
}
