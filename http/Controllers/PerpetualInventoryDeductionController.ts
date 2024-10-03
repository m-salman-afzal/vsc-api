import {PerpetualInventoryDeductionValidaton} from "@validations/PerpetualInventoryDeductionValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {RemovePerpetualInventoryDeductionDto} from "@application/PerpetualInventoryDeduction/Dtos/RemovePerpetualInventoryDeductionDto";
import {UpdatePerpetualInventoryDeductionDto} from "@application/PerpetualInventoryDeduction/Dtos/UpdatePerpetualInventoryDeductionDto";

import {perpetualInventoryDeductionService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class PerpetualInventoryDeductionController {
    static async updatePerpInvDeduction(request: TRequest, response: TResponse) {
        try {
            const {query, params, admin, body} = request;
            PerpetualInventoryDeductionValidaton.updatePerpInvDeductionValidation({
                ...query,
                ...params,
                ...admin,
                ...body
            });
            const dto = UpdatePerpetualInventoryDeductionDto.create({...query, ...params, ...admin, ...body});

            const httpReponse = await perpetualInventoryDeductionService.updatePerpetualInventoryDeduction(dto);

            return HttpResponse.convertToExpress(response, httpReponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removePerpInvDeduction(request: TRequest, response: TResponse) {
        try {
            const {query, params, admin} = request;
            PerpetualInventoryDeductionValidaton.removePerpInvDeductionValidation({...query, ...params, ...admin});
            const dto = RemovePerpetualInventoryDeductionDto.create({...query, ...params, ...admin});

            const httpReponse = await perpetualInventoryDeductionService.removePerpetualInventoryDeduction(dto);

            return HttpResponse.convertToExpress(response, httpReponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
