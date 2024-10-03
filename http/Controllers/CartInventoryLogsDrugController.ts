import {CartInventoryLogsDrugValidation} from "@validations/CartinventoryLogsDrugValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetCartInventoryLogsDrugDto} from "@application/CartInventoryLogsDrug/Dtos/GetCartInventoryLogsDrugDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {cartInventoryLogsDrugService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CartInventoryLogsDrugController {
    static async getCartInventoryLogs(request: TRequest, response: TResponse) {
        try {
            const {query, params} = request;
            CartInventoryLogsDrugValidation.getCartInventoryLogs({...query, ...params, ...params});
            const getCartInventoryDto = GetCartInventoryLogsDrugDto.create({...query, ...params});
            const paginationDTO = PaginationDto.create({...query, ...params});
            const httpResponse = await cartInventoryLogsDrugService.getCartInventoryLogs(
                getCartInventoryDto,
                paginationDTO
            );

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
