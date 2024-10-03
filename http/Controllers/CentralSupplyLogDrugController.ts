import {CentralSupplyLogDrugValidation} from "@validations/CentralSupplyLogDrugValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetCentralSupplyLogDrugDto} from "@application/CentralSupplyLogDrug/Dtos/GetCentralSupplyDrugDto";

import {centralSupplyLogDrugService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CentralSupplyLogDrugController {
    static async getCentralSupplyLogDrugs(request: TRequest, response: TResponse) {
        try {
            const {query, params} = request;
            CentralSupplyLogDrugValidation.getCentralSupplyLogDrugsValidation({...query, ...params});
            const dto = GetCentralSupplyLogDrugDto.create({...query, ...params});
            const httpResponse = await centralSupplyLogDrugService.getCentralSupplyDrugs(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
