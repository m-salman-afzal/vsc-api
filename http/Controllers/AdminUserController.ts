import AdminUserValidation from "@validations/AdminUserValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddAdminDto} from "@application/Admin/Dtos/AddAdminDto";
import {GetAdminDto} from "@application/Admin/Dtos/GetAdminDto";
import {RemoveAdminDto} from "@application/Admin/Dtos/RemoveAdminDto";
import {UpdateAdminDto} from "@application/Admin/Dtos/UpdateAdminDto";
import {UpdateAdminPasswordDto} from "@application/Admin/Dtos/UpdateAdminPasswordDto";
import {UpdateAdminProfileDto} from "@application/Admin/Dtos/UpdateAdminProfileDto";
import {ValidateAdminPasswordDto} from "@application/Admin/Dtos/ValidateAdminPasswordDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {adminUserService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

class AdminUserController {
    static async getAdminUsers(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            AdminUserValidation.getAdminUserValidation(query);
            const paginationDTO = PaginationDto.create(query);
            const httpResponse = await adminUserService.getAdmins(GetAdminDto.create(query as never), paginationDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addAdminUser(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            AdminUserValidation.addAdminUserValidation(body);
            const addAdminDto = AddAdminDto.create(body);
            const httpResponse = await adminUserService.addAdminUser(addAdminDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateAdminUser(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            AdminUserValidation.updateAdminUserValidation({...body, ...params});
            const updateAdminDto = UpdateAdminDto.create({...body, ...params});
            const httpResponse = await adminUserService.updateAdminUser(updateAdminDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeAdminUser(request: TRequest, response: TResponse) {
        try {
            const {params} = request;
            AdminUserValidation.removeAdminUserValidation(params);
            const removeAdminDto = RemoveAdminDto.create(params as never);
            const httpResponse = await adminUserService.removeAdminUser(removeAdminDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateAdminUserProfile(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            AdminUserValidation.updateAdminProfileValidation({...body, adminId: admin?.adminId});
            const DtoAdminProfile = UpdateAdminProfileDto.create({...body, adminId: admin?.adminId});
            const httpResponse = await adminUserService.updateAdminProfile(DtoAdminProfile);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateAdminUserPassword(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            AdminUserValidation.updateAdminPasswordValidation({...body, adminId: admin?.adminId});
            const DtoAdminPassword = UpdateAdminPasswordDto.create({...body, adminId: admin?.adminId});
            const httpResponse = await adminUserService.updateAdminPassword(DtoAdminPassword);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async validateAdminUserPassword(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            AdminUserValidation.validateAdminUserPasswordValidation({...body, adminId: admin?.adminId});
            const DtoValidateAdminPassword = ValidateAdminPasswordDto.create({...body, adminId: admin?.adminId});
            const httpResponse = await adminUserService.validateAdminUserPassword(DtoValidateAdminPassword);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}

export default AdminUserController;
