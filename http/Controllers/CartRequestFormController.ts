import {CartRequestFormValidation} from "@validations/CartRequestFormValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetCartRequestFormDto} from "@application/CartRequestForm/Dtos/GetCartRequestFormDto";
import {UpsertCartRequestFormDto} from "@application/CartRequestForm/Dtos/UpsertCartRequestFormDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {cartRequestFormService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CartRequestFormController {
    static async upsertCartRequestForm(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            CartRequestFormValidation.upsertCartRequestFormValidation(body);
            const dto = UpsertCartRequestFormDto.create(body);
            const httpResponse = await cartRequestFormService.upsertCartRequestForm(dto, admin);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getCartRequestForms(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartRequestFormValidation.getCartRequestFormsValidation(query);
            const dto = GetCartRequestFormDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await cartRequestFormService.getCartRequestForms(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
