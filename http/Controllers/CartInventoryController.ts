import {PerpetualInventoryValidaton} from "@validations/PerpetualInventoryValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetCartInventoryDto} from "@application/CartInventory/Dtos/GetCartInventoryDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {cartInventoryService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CartInventoryController {
    static async getCartInventory(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;
            PerpetualInventoryValidaton.getPerpetualInventoryValidation({...query, ...body});
            const getCartInventoryDto = GetCartInventoryDto.create({...query, ...body});
            const paginationDTO = PaginationDto.create({...query, ...body});
            const httpResponse = await cartInventoryService.getInventory(getCartInventoryDto, paginationDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async submitCartInventory(_request: TRequest, response: TResponse) {
        try {
            const httpResponse = [];
            
return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
