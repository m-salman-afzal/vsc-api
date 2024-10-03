import {ServiceDependencyValidation} from "@validations/ServiceDependencyValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddServiceDependencyDto} from "@application/ServiceDependency/Dtos/AddServiceDependencyDto";

import {serviceDependencyService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ServiceDependencyController {
    static async addServiceDependency(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            ServiceDependencyValidation.addServiceDependencyValidation(body);
            const addDependencyListDto = AddServiceDependencyDto.create(body);
            const httpResponse = await serviceDependencyService.addDependency(addDependencyListDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
