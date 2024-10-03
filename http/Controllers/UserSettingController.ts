import {UserSettingValidation} from "@validations/UserSettingValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddUserSettingDTO} from "@application/UserSetting/DTOs/AddUserSettingDTO";
import {GetUserSettingDTO} from "@application/UserSetting/DTOs/GetUserSettingDTO";
import {UpdateUserSettingDTO} from "@application/UserSetting/DTOs/UpdateUserSettingDTO";

import {userSettingService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class UserSettingController {
    static async addUserSetting(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            UserSettingValidation.addUserSettingValidation(body);
            const addUserSettingDTO = AddUserSettingDTO.create(body);
            const httpResponse = await userSettingService.addUserSetting(addUserSettingDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getUserSettings(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            UserSettingValidation.getUserSettingValidation(query);
            const getUserSettingDTO = GetUserSettingDTO.create(query as never);
            const httpResponse = await userSettingService.getUserSetting(getUserSettingDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateUserSetting(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            UserSettingValidation.updateUserSettingValidation({...body, ...params});
            const updateUserSettingDTO = UpdateUserSettingDTO.create({...body, ...params});
            const httpResponse = await userSettingService.updateUserSetting(updateUserSettingDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
