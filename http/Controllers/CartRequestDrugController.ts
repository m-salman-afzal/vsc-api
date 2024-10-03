import {CartRequestDrugValidation} from "@validations/CartRequestDrugValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetCartAllocationDto} from "@application/CartRequestDrug/Dtos/GetCartAllocationDto";
import {GetCartPickDto} from "@application/CartRequestDrug/Dtos/GetCartPickDto";
import {GetCartRequestDrugDto} from "@application/CartRequestDrug/Dtos/GetCartRequestDrugDto";
import {RemoveCartRequestDrugDto} from "@application/CartRequestDrug/Dtos/RemoveCartRequestDrugDto";
import {UpdateCartAllocationDto} from "@application/CartRequestDrug/Dtos/UpdateCartAllocationDto";
import {UpdateCartPickDto} from "@application/CartRequestDrug/Dtos/UpdateCartPickDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {cartRequestDrugService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CartRequestDrugController {
    static async getCartRequestDrugs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartRequestDrugValidation.GetCartRequestDrugsValidation(query);
            const dto = GetCartRequestDrugDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await cartRequestDrugService.getCartRequestDrugs(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getCartPicks(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartRequestDrugValidation.getCartPickValidation(query);
            const dto = GetCartPickDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await cartRequestDrugService.getCartPicks(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateCartPicks(request: TRequest, response: TResponse) {
        try {
            const {body, admin, query} = request;
            CartRequestDrugValidation.updateCartPickValidation(body);
            const dto = UpdateCartPickDto.create({...body, ...query});
            const httpResponse = await cartRequestDrugService.updateCartPick(dto, admin);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getCartAllocations(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartRequestDrugValidation.getCartAllocationValidation(query);
            const dto = GetCartAllocationDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await cartRequestDrugService.getCartAllocations(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateCartAllocations(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            CartRequestDrugValidation.upsertCartAllocationValidation(body);
            const dto = UpdateCartAllocationDto.create(body);
            const httpResponse = await cartRequestDrugService.updateCartAllocation(dto, admin);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getAdmins(_request: TRequest, response: TResponse) {
        try {
            const httpResponse = await cartRequestDrugService.getCartRequestAdmins();

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeCartRequestDrug(request: TRequest, response: TResponse) {
        try {
            const {query, admin} = request;
            CartRequestDrugValidation.removeCartRequestDrugValidation(query);
            const dto = RemoveCartRequestDrugDto.create(query);
            const httpResponse = await cartRequestDrugService.removeCartRequestDrug(dto, admin);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
