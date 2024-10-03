import {HistoryPhysicalValidation} from "@validations/HistoryPhysicalValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetHistoryPhysicalDTO} from "@application/HistoryPhysical/DTOs/GetHistoryPhysicalDTO";

import {historyPhysicalService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class HistoryPhysicalController {
    static async getHistoryPhysicalData(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            HistoryPhysicalValidation.getHistoryPhysical(query);
            const getHistoryPhysicalDTO = GetHistoryPhysicalDTO.create(query as never);

            const httpResponse = await historyPhysicalService.getHistoryPhysicalData(getHistoryPhysicalDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
