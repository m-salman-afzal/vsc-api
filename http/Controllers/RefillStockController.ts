import {RefillStockValidation} from "@validations/RefillStockValidation";

import HttpResponse from "@appUtils/HttpResponse";

import RefillStockDto from "@application/RefillStock/Dtos/RefillStockDto";

import {refillStockService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class RefillStockController {
    static async refillStockFormulary(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            RefillStockValidation.refillStockFormularyValidation(body);
            const refillStockDto = RefillStockDto.create(body);
            const httpResponse = await refillStockService.refillStockFormulary(refillStockDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
