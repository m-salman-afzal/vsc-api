import {ReferenceGuideDrugValidation} from "@validations/ReferenceGuideDrugValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {ExportReferenceGuideDrugDto} from "@application/ReferenceGuideDrug/Dtos/ExportReferenceGuideDrugDto";
import {GetReferenceGuideDrugDto} from "@application/ReferenceGuideDrug/Dtos/GetReferenceGuideDrugDto";
import {RemoveReferenceGuideDrugDto} from "@application/ReferenceGuideDrug/Dtos/RemoveReferenceGuideDrugDto";
import {UpdateReferenceGuideDrugDto} from "@application/ReferenceGuideDrug/Dtos/UpdateReferenceGuideDrugDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {referenceGuideDrugService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ReferenceGuideDrugController {
    static async getReferenceGuideDrugs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ReferenceGuideDrugValidation.getReferenceGuideDrugValidation({...query});

            const dtoGetReferenceGuideDrug = GetReferenceGuideDrugDto.create(query);
            const dtoPagination = PaginationDto.create(query);

            const httpResponse = await referenceGuideDrugService.getReferenceGuideDrugs(
                dtoGetReferenceGuideDrug,
                dtoPagination
            );

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async exportReferenceGuideDrugs(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ReferenceGuideDrugValidation.exportReferenceGuideDrugValidation({...query});

            const dtoExportReferenceGuideDrug = ExportReferenceGuideDrugDto.create(query);

            const httpResponse = await referenceGuideDrugService.exportReferenceGuideDrugs(dtoExportReferenceGuideDrug);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateReferenceGuideDrug(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            ReferenceGuideDrugValidation.updateReferenceGuideDrugValidation({...body, ...params});

            const dtoUpdateReferenceGuideDrug = UpdateReferenceGuideDrugDto.create({...body, ...params});
            const httpResponse = await referenceGuideDrugService.updateReferenceGuideDrug(dtoUpdateReferenceGuideDrug);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeReferenceGuideDrug(request: TRequest, response: TResponse) {
        try {
            const {params, query} = request;
            ReferenceGuideDrugValidation.removeReferenceGuideDrugValidation({...params, ...query});

            const dtoRemoveReferenceGuideDrug = RemoveReferenceGuideDrugDto.create({...params, ...query});
            const httpResponse = await referenceGuideDrugService.removeReferenceGuideDrug(dtoRemoveReferenceGuideDrug);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getReferenceGuideDrugCategories(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ReferenceGuideDrugValidation.getReferenceGuideDrugValidation(query);

            const dtoGetReferenceGuideDrugCategoriesDto = GetReferenceGuideDrugDto.create(query);
            const httpResponse = await referenceGuideDrugService.getReferenceGuideDrugCategories(
                dtoGetReferenceGuideDrugCategoriesDto
            );

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
