import {RoleValidation} from "@validations/RoleValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddRoleDto} from "@application/Role/Dtos/AddRoleDto";
import {GetRoleDto} from "@application/Role/Dtos/GetRoleDto";
import {RemoveRoleDto} from "@application/Role/Dtos/RemoveRoleDto";
import {UpdateRoleDto} from "@application/Role/Dtos/UpdateRoleDto";

import {roleService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class RoleController {
    static async getRoles(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            RoleValidation.getRoleValidation(query);
            const getRoleDto = GetRoleDto.create(query);
            const httpResponse = await roleService.getRoles(getRoleDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addRole(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            RoleValidation.addRoleValidation(body);
            const addRoleDto = AddRoleDto.create(body);
            const httpResponse = await roleService.addRole(addRoleDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateRole(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            RoleValidation.updateRoleValidation(body.data);
            const updateRoleDto = UpdateRoleDto.create(body.data);
            const httpResponse = await roleService.updateRole(updateRoleDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeRole(request: TRequest, response: TResponse) {
        try {
            const {params} = request;
            RoleValidation.removeRoleValidation(params);
            const removeRoleDto = RemoveRoleDto.create(params);
            const httpResponse = await roleService.removeRole(removeRoleDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
