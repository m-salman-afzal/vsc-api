import {FormularyLevelValidation} from "@validations/FormularyLevelValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddFormularyLevelDto} from "@application/FormularyLevel/Dtos/UpsertFormularyLevelDto";

import {formularyLevelService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class FormularyLevelController {
    static async upsertFormularyLevel(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            FormularyLevelValidation.upsertFormularyLevelValidation(body);
            const addFormularyLevelDto = AddFormularyLevelDto.create(body);
            const httpResponse = await formularyLevelService.upsertFormularyLevel(addFormularyLevelDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
