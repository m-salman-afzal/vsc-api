import {FormularyValidation} from "@validations/FormularyValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddFormularyDto} from "@application/Formulary/Dtos/AddFormularyDto";
import {GetAllFormularyDto} from "@application/Formulary/Dtos/GetAllFomulary";
import {GetFormularyDto} from "@application/Formulary/Dtos/GetFormularyDto";
import {RemoveFormularyDto} from "@application/Formulary/Dtos/RemoveFormularyDto";
import {UpdateFormularyDto} from "@application/Formulary/Dtos/UpdateFormularyDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {formularyService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class FormularyController {
    static async addFormulary(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            FormularyValidation.addFormularyValidation(body);
            const addFormularyDto = AddFormularyDto.create(body);
            const httpResponse = await formularyService.addFormulary(addFormularyDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getFormulary(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            FormularyValidation.getFormularyValidation(query);
            const getFormularyDto = GetFormularyDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await formularyService.getFormulary(getFormularyDto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateFormulary(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            FormularyValidation.updateFormualaryValidation({...body, ...params});
            const updateFormularyDto = UpdateFormularyDto.create({...body, ...params});
            const httpResponse = await formularyService.updateFormulary(updateFormularyDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeFormulary(request: TRequest, response: TResponse) {
        try {
            const {params} = request;
            FormularyValidation.removeFormularyValidation(params);
            const removeFormularyDto = RemoveFormularyDto.create(params);
            const httpResponse = await formularyService.removeFormulary(removeFormularyDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getAllFormulary(_request: TRequest, response: TResponse) {
        try {
            const {query} = _request;
            const getAllFormularyDto = GetAllFormularyDto.create(query);
            const httpResponse = await formularyService.getAllFormulary(getAllFormularyDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
