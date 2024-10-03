import {AuditLogValidation} from "@validations/AuditLogValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetAuditLogDto} from "@application/AuditLog/DTOs/GetAuditLogDto";
import {SearchAuditLogDto} from "@application/AuditLog/DTOs/SearchAuditLogDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {auditLogService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class AuditLogController {
    static async getAuditLogs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            AuditLogValidation.getAuditLogValidation(query);
            const getAuditLogDto = GetAuditLogDto.create(query);
            const paginationDTO = PaginationDto.create(query);
            const httpResponse = await auditLogService.getAuditLogs(getAuditLogDto, paginationDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: await ErrorLog(error)}));
        }
    }

    static async searchAuditLogs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            AuditLogValidation.searchAuditLogsValidation(query);
            const searchAuditLogDto = SearchAuditLogDto.create(query);

            const paginationDTO = PaginationDto.create(query);

            const httpResponse = await auditLogService.searchAuditLogs(searchAuditLogDto, paginationDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: await ErrorLog(error)}));
        }
    }
}
