import {InventoryHistoryValidation} from "@validations/InventoryHistoryValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {DownloadInventoryHistoryDto} from "@application/InventoryHistory/Dtos/DownloadInventoryHistoryDto";
import {GetInventoryHistoryListDto} from "@application/InventoryHistory/Dtos/GetInventoryHistoryListDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {inventoryHistoryService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class InventoryHistorytController {
    static async getInventoryHistoryList(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            InventoryHistoryValidation.getInventoryHistoryList(query);
            const dto = GetInventoryHistoryListDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await inventoryHistoryService.getInventoryHistoryList(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async downloadInventoryHistory(request: TRequest, response: TResponse) {
        try {
            const {params, query} = request;
            InventoryHistoryValidation.downloadInventoryHistory({...params, ...query});
            const dto = DownloadInventoryHistoryDto.create({...params, ...query});
            const httpResponse = await inventoryHistoryService.downloadInventoryHistory(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
