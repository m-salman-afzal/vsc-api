import DivisionSwornValidation from "@validations/DivisionSwornValidation";

import HttpResponse from "@appUtils/HttpResponse";

import GetDivisionSwornDTO from "@application/DivisionSworn/DTOs/GetDivisionSwornDTO";

import {divisionSwornService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

class DivisionSwornController {
    static async getSwornPersonnel(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            DivisionSwornValidation.getDivisionSwornValidation(query);
            const dtoGetDivisionSworn = GetDivisionSwornDTO.create(query as unknown as GetDivisionSwornDTO);
            const httpResponse = await divisionSwornService.getSwornPersonnel(dtoGetDivisionSworn);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}

export default DivisionSwornController;
