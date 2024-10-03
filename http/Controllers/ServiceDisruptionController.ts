import ServiceDisruptionValidation from "@validations/ServiceDisruptionValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetServiceDisruptionDto} from "@application/ServiceDisruption/Dtos/GetServiceDisruptionDto";
import {RemoveServiceDisruptionDto} from "@application/ServiceDisruption/Dtos/RemoveServiceDisruptionDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {serviceDisruptionService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ServiceDisruptionController {
    static async getServiceDisruption(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ServiceDisruptionValidation.getServiceDisruptionValidation(query);
            const getServiceDisruptionDto = GetServiceDisruptionDto.create(query);
            const paginationDTO = PaginationDto.create(query);
            const httpResponse = await serviceDisruptionService.getServiceDisruption(
                getServiceDisruptionDto,
                paginationDTO
            );

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeServiceDisruption(request: TRequest, response: TResponse) {
        try {
            const {params, query} = request;
            ServiceDisruptionValidation.removeServiceDisruptionValidation({...query, ...params});

            const dtoRemoveServiceDisruption = RemoveServiceDisruptionDto.create({...query, ...params});
            const httpResponse = await serviceDisruptionService.removeServiceDisruption(dtoRemoveServiceDisruption);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
