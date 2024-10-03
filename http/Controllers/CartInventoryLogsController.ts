import {CartInventoryLogsValidation} from "@validations/CartInventoryLogsValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddCartInventoryDto} from "@application/CartInventory/Dtos/AddCartInventoryDto";
import {GetCartInventoryLogsDto} from "@application/CartInventoryLogs/Dtos/GetCartInventoryLogsDto";
import {GetCartsDto} from "@application/CartInventoryLogs/Dtos/GetCartsDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {cartInventoryLogsService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CartInventoryLogsController {
    static async getCartInventoryLogs(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;
            CartInventoryLogsValidation.getCartInventoryLogs({...query, ...body});
            const getCartInventoryDto = GetCartInventoryLogsDto.create({...query, ...body});
            const paginationDTO = PaginationDto.create({...query, ...body});
            const httpResponse = await cartInventoryLogsService.getCartInventoryLogs(
                getCartInventoryDto,
                paginationDTO
            );

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addCartInventoryLog(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;

            CartInventoryLogsValidation.addCartInventoryLogs({...body, ...query});
            const addCartInventoryLogdto = AddCartInventoryDto.create({...query, ...body});
            const httpResponse = await cartInventoryLogsService.addCartInventoryLogs(addCartInventoryLogdto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getCarts(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;

            CartInventoryLogsValidation.getCarts({...body, ...query});
            const getCartsDto = GetCartsDto.create({...query, ...body});
            const httpResponse = await cartInventoryLogsService.getCarts(getCartsDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
