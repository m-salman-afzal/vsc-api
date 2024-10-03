import {InventoryValidation} from "@validations/InventoryValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddInventoryDto} from "@application/Inventory/Dtos/AddInventoryDto";
import {GetAllInventoryDto} from "@application/Inventory/Dtos/GetAllInventoryDto";
import {GetControlledIdDto} from "@application/Inventory/Dtos/GetControlledIdDto";
import {GetInventoryDto} from "@application/Inventory/Dtos/GetInventoryDto";
import {GetInventorySuggestionDto} from "@application/Inventory/Dtos/GetInventorySuggestionDto";
import {RemoveInventoryDto} from "@application/Inventory/Dtos/RemoveInventoryDto";
import {UpdateInventoryDto} from "@application/Inventory/Dtos/UpdateInventoryDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {inventoryService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class InventoryController {
    static async addInventory(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            InventoryValidation.addInventoryValidation(body);
            const addInventoryDto = AddInventoryDto.create(body);
            const httpResponse = await inventoryService.addInventory(addInventoryDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getInventory(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            InventoryValidation.getInventoryValidation(query);
            const getInventoryDto = GetInventoryDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await inventoryService.getInventory(getInventoryDto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateInventory(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            InventoryValidation.updateInventoryValidation({...body, ...params});
            const updateInventoryDto = UpdateInventoryDto.create({...body, ...params});
            const httpResponse = await inventoryService.updateInventory(updateInventoryDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeInventory(request: TRequest, response: TResponse) {
        try {
            const {params, query} = request;
            InventoryValidation.removeInventoryValidation(params);
            const removeInventoryDto = RemoveInventoryDto.create({...params, ...query});
            const httpResponse = await inventoryService.removeInventory(removeInventoryDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getInventorySuggestion(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            InventoryValidation.getInventorySuggestionValidation(query);
            const getInventoryDto = GetInventorySuggestionDto.create(query);
            const httpResponse = await inventoryService.getInventorySuggestions(getInventoryDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getAllInventory(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            InventoryValidation.getAllInventoryValidation(query);
            const getAllInventoryDto = GetAllInventoryDto.create(query);
            const httpResponse = await inventoryService.getAllInventory(getAllInventoryDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getControlledIds(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            InventoryValidation.getControlledIdsValidation(query);
            const dto = GetControlledIdDto.create(query);
            const httpResponse = await inventoryService.getControlledIds(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
