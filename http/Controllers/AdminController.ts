import AdminValidation from "@validations/AdminValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddAdminDto} from "@application/Admin/Dtos/AddAdminDto";
import {GetAdminDto} from "@application/Admin/Dtos/GetAdminDto";
import {RemoveAdminDto} from "@application/Admin/Dtos/RemoveAdminDto";
import {UpdateAdminDto} from "@application/Admin/Dtos/UpdateAdminDto";

import {adminService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class AdminController {
    static async addAdmin(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            AdminValidation.addAdminValidation(body);
            const addAdminDto = AddAdminDto.create(body);
            const httpResponse = await adminService.addAdmin(addAdminDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getAdmins(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            AdminValidation.getAdminValidation({...query});
            const getAdminDto = GetAdminDto.create({...query});
            const httpResponse = await adminService.getAdmins(getAdminDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateAdmin(request: TRequest, response: TResponse) {
        try {
            const {body, params, admin} = request;
            AdminValidation.updateAdminValidation({...body, ...params});
            const updateAdminDto = UpdateAdminDto.create({...body, ...params});
            const httpResponse = await adminService.updateAdmin(updateAdminDto, admin);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeAdmin(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            AdminValidation.removeAdminValidation({...body, ...params});
            const removeAdminDto = RemoveAdminDto.create({...body, ...params});
            const httpResponse = await adminService.removeAdmin(removeAdminDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
