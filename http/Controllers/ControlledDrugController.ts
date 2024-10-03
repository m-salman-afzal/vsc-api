import {ControlledDrugValidation} from "@validations/ControlledDrugValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {RemoveControlledDrugDto} from "@application/ControlledDrug/Dtos/RemoveControlledDrugDto";
import {UpdateControlledDrugDto} from "@application/ControlledDrug/Dtos/UpdateControlledDrugDto";

import {controlledDrugService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ControlledDrugController {
    static async updateControlledDrug(request: TRequest, response: TResponse) {
        try {
            const {params, body} = request;
            ControlledDrugValidation.updateControlledDrugValidation({...params, ...body});
            const dto = UpdateControlledDrugDto.create({...params, ...body});
            const httpResponse = await controlledDrugService.updateControlledDrug(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: await ErrorLog(error)}));
        }
    }

    static async removeControlledDrug(request: TRequest, response: TResponse) {
        try {
            const {params, query} = request;
            ControlledDrugValidation.removeControlledDrugValidation(params);
            const dto = RemoveControlledDrugDto.create({...params, ...query});
            const httpResponse = await controlledDrugService.removeControlledDrug(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: await ErrorLog(error)}));
        }
    }
}
