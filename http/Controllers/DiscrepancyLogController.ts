import {DiscrepancyLogValidation} from "@validations/DiscrepancyLogValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetDiscrepancyLogDto} from "@application/DiscrepancyLog/Dtos/GetDiscrepancyLog";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {discrepancyLogService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class DiscrepancyLogController {
    static async getDiscrepancyLog(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            DiscrepancyLogValidation.getDiscrepancyLogValidation(query);
            const dto = GetDiscrepancyLogDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await discrepancyLogService.getDiscrepanceyLogs(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: await ErrorLog(error)}));
        }
    }
}
