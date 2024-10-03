import {CartRequestLogValidation} from "@validations/CartRequestLogValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetCartRequestLogDto} from "@application/CartRequestLog/Dtos/GetCartRequestLogDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {cartRequestLogService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CartRequestLogController {
    static async getCartRequestLogs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartRequestLogValidation.GetCartRequestLogsValidation(query);
            const dto = GetCartRequestLogDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await cartRequestLogService.getCartRequestLogs(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
