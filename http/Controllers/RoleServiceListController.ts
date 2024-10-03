import {RoleServiceListValidation} from "@validations/RoleServiceListValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddRoleServiceListDto} from "@application/RoleServiceList/Dtos/AddRoleServiceListDto";
import {RemoveRoleServiceListDto} from "@application/RoleServiceList/Dtos/RemoveRoleServiceListDto";
import {UpdateRoleServiceListDto} from "@application/RoleServiceList/Dtos/UpdateRoleServiceListDto";

import {roleServiceListService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class RoleServiceListController {
    static async getRoleServiceLists(_request: TRequest, response: TResponse) {
        try {
            const httpResponse = await roleServiceListService.getRoleServiceLists();

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addRoleServiceList(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            RoleServiceListValidation.addRoleServiceListValidation(body);
            const addRoleServiceListDto = AddRoleServiceListDto.create(body);
            const httpResponse = await roleServiceListService.addRoleServiceList(addRoleServiceListDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateRoleServiceList(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            RoleServiceListValidation.updateRoleServiceListValidation(body.data);
            const updateRoleServiceListDto = UpdateRoleServiceListDto.create(body.data);
            const httpResponse = await roleServiceListService.updateRoleServiceList(updateRoleServiceListDto, admin);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeRoleServiceList(request: TRequest, response: TResponse) {
        try {
            const {params} = request;
            RoleServiceListValidation.removeRoleServiceListValidation(params);
            const removeRoleServiceListDto = RemoveRoleServiceListDto.create(params);
            const httpResponse = await roleServiceListService.removeRoleServiceList(removeRoleServiceListDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
