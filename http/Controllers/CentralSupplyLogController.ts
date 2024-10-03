import {CentralSupplyLogValidation} from "@validations/CentralSupplyLogValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddCentralSupplyLogDto} from "@application/CentralSupplyLog/Dtos/AddCentralSupplyLogDto";
import {DownloadCentralSupplyLogDto} from "@application/CentralSupplyLog/Dtos/DownloadCentralSupplyLogDto";
import {GetCentralSupplyDrugsDto} from "@application/CentralSupplyLog/Dtos/GetCentralSupplyDrugsDto";
import {GetCentralSupplyLogDto} from "@application/CentralSupplyLog/Dtos/GetCentralSupplyLogDto";
import {GetMinMaxOrderedQuantityDto} from "@application/CentralSupplyLog/Dtos/GetMinMaxOrderedQuantity";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {centralSupplyLogService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CentralSupplyLogController {
    static async getCentralSupplyDrugs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CentralSupplyLogValidation.getCentralSupplyDrugsValidation(query);
            const dto = GetCentralSupplyDrugsDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await centralSupplyLogService.getCentralSupplyDrugs(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addCentralSupplyLog(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            CentralSupplyLogValidation.addCentralSupplyLogValidation(body);
            const dto = AddCentralSupplyLogDto.create(body);
            const httpResponse = await centralSupplyLogService.addCentralSupplyLog(dto, admin);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getCentralSupplyLogs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CentralSupplyLogValidation.getCentralSupplyLogsValidation(query);
            const dto = GetCentralSupplyLogDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await centralSupplyLogService.getCentralSupplyLogs(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getMinMaxOrderedQuantity(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CentralSupplyLogValidation.getMinMaxOrderedQuantityValidation(query);
            const dto = GetMinMaxOrderedQuantityDto.create(query);
            const httpResponse = await centralSupplyLogService.getMinMaxOrderedQuantity(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async downloadCentralSupplyLog(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CentralSupplyLogValidation.downloadCentralSupplyLog(query);
            const dto = DownloadCentralSupplyLogDto.create(query);
            const httpResponse = await centralSupplyLogService.downloadCentralSupplyLog(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
