import LogValidation from "@validations/LogValidation";

import HttpResponse from "@appUtils/HttpResponse";

import GetLogDTO from "@application/Log/DTOs/GetLogDTO";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {logService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

class LogController {
    static async getLogs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            LogValidation.getLogReportValidation(query);
            const getLogDTO = GetLogDTO.create(query);
            const paginationDTO = PaginationDto.create(query);
            const httpResponse = await logService.getLogs(getLogDTO, paginationDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}

export default LogController;
