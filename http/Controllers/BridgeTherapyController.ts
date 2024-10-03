import {BridgeTherapyValidation} from "@validations/BridgeTherapyValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddBridgeTherapyDto} from "@application/BridgeTherapy/Dtos/AddBridgeTherapyDto";
import {DownloadBridgeTherapyLogDto} from "@application/BridgeTherapy/Dtos/DownloadBridgeTherapyLogDto";
import {GetBridgeTherapyAdminDto} from "@application/BridgeTherapy/Dtos/GetBridgeTherapyAdminsDto";
import {GetBridgeTherapyLogDto} from "@application/BridgeTherapy/Dtos/GetBridgeTherapyLogDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {bridgeTherapyService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {TRequest, TResponse} from "@typings/Express";

export class BridgeTherapyController {
    static async addBridgeTherapy(request: TRequest, response: TResponse) {
        try {
            const {query, body, admin} = request;
            BridgeTherapyValidation.addBridgeTherapy({...body, ...query, adminId: (admin as AdminEntity).adminId});
            const dto = AddBridgeTherapyDto.create({
                ...body,
                ...query,
                adminId: (admin as AdminEntity).adminId
            });
            const httpResponse = await bridgeTherapyService.addBridgeTherapy(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getBridgeTherapyLogs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            BridgeTherapyValidation.getBridgeTherapyLogValidation(query);
            const dto = GetBridgeTherapyLogDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await bridgeTherapyService.getBridgeTherapyLogs(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async downloadBridgeTherapyLog(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            BridgeTherapyValidation.downloadBridgeTherapyLogValidation(query);
            const dto = DownloadBridgeTherapyLogDto.create(query);
            const httpResponse = await bridgeTherapyService.downloadBridgeTherapyLog(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getBridgeTherapyAdmins(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            BridgeTherapyValidation.getBridgeTherapyAdminsValidation(query);
            const dto = GetBridgeTherapyAdminDto.create(query);
            const httpResponse = await bridgeTherapyService.getBridgeTherapyAdmins(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
