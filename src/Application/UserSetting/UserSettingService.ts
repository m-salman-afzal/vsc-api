import {inject, injectable} from "tsyringe";

import {UserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {UserSettingFilter} from "@repositories/Shared/ORM/UserSettingFilter";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddUserSettingDTO} from "./DTOs/AddUserSettingDTO";
import type {GetUserSettingDTO} from "./DTOs/GetUserSettingDTO";
import type {UpdateUserSettingDTO} from "./DTOs/UpdateUserSettingDTO";
import type {IUserSettingRepository} from "@entities/UserSetting/IUserSettingRepository";

@injectable()
export class UserSettingService {
    constructor(@inject("IUserSettingRepository") private userSettingRepository: IUserSettingRepository) {}

    async subAddUserSetting(addUserSettingDTO: AddUserSettingDTO) {
        const searchFilters = UserSettingFilter.setFilter(addUserSettingDTO);
        const isUserSetting = await this.userSettingRepository.fetch(searchFilters);
        if (isUserSetting) {
            return false;
        }

        const userSettingEntity = UserSettingEntity.create(addUserSettingDTO);
        userSettingEntity.userSettingId = SharedUtils.shortUuid();
        await this.userSettingRepository.create(userSettingEntity);

        return userSettingEntity;
    }

    async addUserSetting(addUserSettingDTO: AddUserSettingDTO) {
        try {
            const userSettingEntity = await this.subAddUserSetting(addUserSettingDTO);
            if (!userSettingEntity) {
                return HttpResponse.conflict();
            }

            return HttpResponse.created(UserSettingEntity.create(userSettingEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetUserSettings(getUserSettingDTO: GetUserSettingDTO) {
        const searchFilters = UserSettingFilter.setFilter(getUserSettingDTO);
        const userSettings = await this.userSettingRepository.fetchAll(searchFilters, {id: ORDER_BY.DESC});
        if (!userSettings) {
            return false;
        }

        return userSettings;
    }

    async getUserSetting(getUserSettingDTO: GetUserSettingDTO) {
        try {
            const isUserSetting = await this.subGetUserSettings(getUserSettingDTO);
            if (!isUserSetting) {
                return HttpResponse.conflict();
            }

            return HttpResponse.created(UserSettingEntity.create(isUserSetting));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subUpdateUserSetting(updateUserSettingDTO: UpdateUserSettingDTO) {
        const isUserSetting = await this.userSettingRepository.fetch({
            userSettingId: updateUserSettingDTO.userSettingId
        });
        if (!isUserSetting) {
            return false;
        }

        const userSettingEntity = UserSettingEntity.create({...isUserSetting, ...updateUserSettingDTO});
        userSettingEntity.setting = {defaultFacilityId: updateUserSettingDTO.defaultFacilityId} as never;
        await this.userSettingRepository.update({userSettingId: updateUserSettingDTO.userSettingId}, userSettingEntity);

        return userSettingEntity;
    }

    async updateUserSetting(updateUserSettingDTO: UpdateUserSettingDTO) {
        try {
            const isUserSetting = await this.subUpdateUserSetting(updateUserSettingDTO);
            if (!isUserSetting) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(isUserSetting);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
